// components/WebRTCComponent.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
// SimplePeer دیگر برای چت متنی مستقیم بین کاربر و ادمین از طریق سرور لازم نیست، مگر اینکه بخواهیم P2P نگه داریم.
// برای سادگی فعلا آن را حذف یا کامنت می‌کنیم، چون پیام‌ها از طریق سرور رله می‌شوند.
// import SimplePeer, { Instance as PeerInstance, SignalData } from 'simple-peer';

export interface ChatPartner {
  id: string; // socket.id
  identifier: string;
  role: 'user' | 'expert';
}

export interface WebRTCComponentHandles {
  // Define any methods you want to expose via ref if needed
}

interface WebRTCComponentProps {
  roomId: string;
  userId: string; // User-provided ID/name (identifier of the current user)
  userRole: 'user' | 'expert';
  socket: Socket | null; // Passed from the parent page
  chatPartner: ChatPartner | null; // The user/expert this component is chatting with
}

interface Message {
  id: string;
  text: string;
  senderId: string; // socket.id of the sender
  senderIdentifier: string; // User-provided ID/name of the sender for display
  senderRole: 'user' | 'expert' | 'system';
  timestamp: number;
  roomId?: string; // Optional: if messages are room-specific on client side too
  self?: boolean;
}

const WebRTCComponent = React.forwardRef<WebRTCComponentHandles, WebRTCComponentProps>(({ roomId, userId, userRole, socket, chatPartner }, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  // socketRef is no longer needed as socket is passed as a prop
  // const socketRef = useRef<Socket | null>(null);
  // peersRef دیگر برای مدل چت متمرکز بر سرور ضروری نیست.
  // const peersRef = useRef<Record<string, PeerInstance>>({}); 
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // currentAdminTarget is replaced by chatPartner prop
  // const [currentAdminTarget, setCurrentAdminTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listener for receiving messages
    const handleReceiveMessage = (message: Message) => {
      // Ensure message is for the current chat session if chatPartner is defined
      if (chatPartner) {
        // Check if the message is from the chat partner or self
        if (message.senderId === chatPartner.id || message.senderId === socket.id) {
          setMessages(prev => [...prev, message]);
        } else if (message.self && message.senderId === socket.id) { // Message echoed to self
           setMessages(prev => [...prev, message]);
        }
      } else if (message.senderRole === 'system') {
        // Allow system messages even if not in a direct chat
        setMessages(prev => [...prev, message]);
      }
    };

    // Listener for WebRTC signals
    const handleSignal = (data: { from: string; signal: any; fromRole: 'user' | 'expert' }) => {
      // This part needs to be implemented if P2P WebRTC video/audio is still desired.
      // For server-mediated text chat, this might not be strictly necessary for messages,
      // but would be for direct P2P connections.
      // For now, we'll assume signaling is for P2P features not yet fully re-integrated.
      console.log('Received signal:', data);
      // Example: if (peersRef.current[data.from]) { peersRef.current[data.from].signal(data.signal); }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('signal', handleSignal);
    // System messages like 'error-message' or 'chat-ended' are handled in the parent (WebRTCChatPage)
    // as they affect the overall state (queue, chatPartner, etc.)

    // Clear messages when chat partner changes or disconnects
    setMessages([]); 

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('signal', handleSignal);
      // The socket itself is managed by the parent component (WebRTCChatPage)
      // No need to disconnect it here.
    };
  }, [socket, chatPartner, roomId, userId]); // Rerun when socket or chatPartner changes

  // This useEffect is no longer needed as chatPartner prop handles this state.
  // useEffect(() => {
  //   if (userRole === 'expert') {
  //       // Logic related to targetUserIdForAdmin was here
  //   }
  // }, [targetUserIdForAdmin, userRole]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // createPeer and related WebRTC peer logic can be removed or heavily modified
  // if all chat is server-mediated.

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

        // Message data no longer needs roomId, userId, userRole, or toUserId here,
    // as the server infers this from the socket connection and active session.
    // The 'send-message' event on the server now only expects { text: string }.
    const messageData = {
      text: inputValue,
    };

    if (socket && (chatPartner || userRole === 'user')) { // Allow users to send even if partner not yet assigned (e.g. to a general room if supported, or server handles)
      socket.emit('send-message', messageData);
    } else if (socket && userRole === 'expert' && !chatPartner) {
      // Optionally, inform expert they need to select a user first
      setMessages(prev => [...prev, {
        id: `local-${Date.now()}`,
        text: 'لطفا ابتدا یک کاربر را برای چت انتخاب کنید.',
        senderId: 'system',
        senderIdentifier: 'System',
        senderRole: 'system',
        timestamp: Date.now(),
      }]);
    }

    // Add message to local display immediately for better UX
    // The server will broadcast it back, but this makes it feel instant for the sender.
    // However, ensure not to duplicate if server also sends to sender.
    // For now, let's assume server does NOT send back to original sender on 'receive-message' for their own messages.
    // Or, the server can send a confirmation with the final message object (including server-generated ID and timestamp).
    // To avoid duplication, we can rely on server sending the message back via 'receive-message'.
    // Let's remove immediate local add and rely on server echo for consistency.
    /*
    setMessages(prev => [...prev, {
        id: `local-${Date.now()}`,
        text: inputValue,
        senderId: socketRef.current?.id || 'local-user', // This would be the socket ID
        senderIdentifier: userId, // This is the user-provided name
        senderRole: userRole,
        timestamp: Date.now(),
    }]);
    */
    setInputValue('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Header can be simplified or removed if parent page shows this info */}
      {/* <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px', padding: '10px', backgroundColor:'#f0f0f0' }}>
        {chatPartner ? `Chatting with: ${chatPartner.identifier}` : (userRole === 'user' ? 'Waiting for expert...' : 'Select a user to chat')}
      </h3> */}
      <div
        ref={chatContainerRef}
        style={{
          flexGrow: 1,
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '8px',
              padding: '8px 12px',
              borderRadius: '10px',
              maxWidth: '70%',
              wordWrap: 'break-word',
              // Use msg.senderId (socket.id from server) to check if it's the current user's message
              alignSelf: msg.senderId === socket?.id ? 'flex-end' : 'flex-start',
              marginLeft: msg.senderId === socket?.id ? 'auto' : '0',
              marginRight: msg.senderId === socket?.id ? '0' : 'auto',
              backgroundColor: msg.senderId === socket?.id ? '#dcf8c6' : (msg.senderRole === 'system' ? '#e0e0e0' : '#fff'),
              color: msg.senderRole === 'system' ? '#555' : '#000',
              border: msg.senderRole !== 'system' ? '1px solid #eee' : 'none',
            }}
          >
            <strong style={{ color: msg.senderRole === 'expert' ? 'blue' : (msg.senderRole === 'user' ? 'green' : 'gray')}}>
              {/* Display senderIdentifier (user-provided name) */}
              {msg.senderRole === 'system' ? 'System' : (msg.senderId === socket?.id ? 'You' : `${msg.senderIdentifier}`)}:
            </strong> {msg.text}
            <div style={{ fontSize: '0.7em', color: '#777', textAlign: msg.senderId === socket?.id ? 'right' : 'left', marginTop: '3px' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={userRole === 'expert' && !chatPartner ? "Select a user to start chatting" : "Type a message..."}
          style={{ flexGrow: 1, padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          disabled={userRole === 'expert' && !chatPartner}
        />
        <button 
            onClick={handleSendMessage} 
            style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: (userRole === 'expert' && !chatPartner) ? 'not-allowed' : 'pointer' }}
            disabled={userRole === 'expert' && !chatPartner}
        >
          Send
        </button>
      </div>
    </div>
  );
})

export default WebRTCComponent;
