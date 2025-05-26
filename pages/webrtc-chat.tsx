// pages/webrtc-chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import WebRTCComponent, { WebRTCComponentHandles } from '../components/WebRTCComponent'; // مسیر ممکن است نیاز به بررسی داشته باشد
import io, { Socket } from 'socket.io-client'; // برای ارتباطات ادمین

interface QueueUser {
  socketId: string;
  identifier: string;
}

interface ChatPartner {
  id: string; // socket.id
  identifier: string;
  role: 'user' | 'expert';
}

const WebRTCChatPage = () => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState<'user' | 'expert'>('user');
  const [showChat, setShowChat] = useState(false);
  const [userQueue, setUserQueue] = useState<QueueUser[]>([]); // For experts to see the queue
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [systemMessage, setSystemMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (showChat && !socketRef.current) {
      socketRef.current = io({ path: '/api/socket' });
      const currentSocket = socketRef.current;

      currentSocket.on('connect', () => {
        console.log(`Socket connected: ${currentSocket.id} as ${userRole}`);
        currentSocket.emit('join-room', roomId, userId, userRole); // userId is used as identifier
        setSystemMessage('در حال اتصال به سرور چت...');
      });

      // Common event for both user and expert
      currentSocket.on('chat-started', (data: { partner: ChatPartner; roomId: string }) => {
        console.log('Chat started with:', data.partner);
        setChatPartner(data.partner);
        setQueuePosition(null);
        setSystemMessage(`چت با ${data.partner.identifier} (${data.partner.role}) آغاز شد.`);
        setUserQueue([]); // Clear queue for expert if they were viewing it
      });

      currentSocket.on('chat-ended', (data: { by: string; message: string }) => {
        console.log('Chat ended:', data.message);
        setChatPartner(null);
        setSystemMessage(`چت پایان یافت: ${data.message}`);
        // Experts become available again, users might be re-queued or informed.
        if (userRole === 'expert') {
          // Experts might want to see the queue again or be auto-assigned
          currentSocket.emit('join-room', roomId, userId, userRole); // Re-join to become available
        } else {
          // Users might get a message about re-queueing or next steps
          setQueuePosition(null); // Reset queue position
        }
      });

      currentSocket.on('error-message', (data: { text?: string; message?: string }) => {
        console.error('Server error:', data.text || data.message);
        setSystemMessage(`خطای سرور: ${data.text || data.message}`);
      });

      if (userRole === 'user') {
        currentSocket.on('added-to-queue', (data: { roomId: string; position: number; queueLength: number }) => {
          console.log('Added to queue:', data);
          setQueuePosition(data.position);
          setSystemMessage(`شما در صف انتظار هستید. نفر ${data.position} از ${data.queueLength}`);
        });

        currentSocket.on('queue-full', (data: { roomId: string }) => {
          console.log('Queue is full for room:', data.roomId);
          setSystemMessage('صف انتظار پر است. لطفا بعدا تلاش کنید.');
          // Optionally, disconnect or prevent further actions
        });
      }

      if (userRole === 'expert') {
        currentSocket.on('expert-registered', (data: { expertId: string; roomId: string }) => {
          console.log('Expert registered:', data);
          setSystemMessage('شما به عنوان کارشناس ثبت شدید و آماده دریافت درخواست‌ها هستید.');
        });

        currentSocket.on('queue-updated', (data: { roomId: string; queue: QueueUser[] }) => {
          console.log('Queue updated:', data.queue);
          if (!chatPartner) { // Only show queue if not in active chat
            setUserQueue(data.queue);
            setSystemMessage(data.queue.length > 0 ? `تعداد کاربران در صف: ${data.queue.length}` : 'در حال حاضر کاربری در صف انتظار نیست.');
          }
        });
      }

      // WebRTCComponent will handle 'signal' and 'receive-message' internally via its own socket instance
      // or by passing the main socket instance to it.
      // For simplicity, we assume WebRTCComponent handles its socket events for signaling and messages.

    }

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket:', socketRef.current.id);
        socketRef.current.disconnect();
        socketRef.current = null;
        setChatPartner(null);
        setQueuePosition(null);
        setUserQueue([]);
        setSystemMessage('');
      }
    };
  }, [showChat, userRole, roomId, userId, chatPartner]); // Added chatPartner to dependencies

  const handleJoinRoom = () => {
    if (roomId.trim() && userId.trim()) {
      setShowChat(true);
      // Socket connection will be initiated by the useEffect hook
    }
  };

  const handlePickUser = (userSocketId: string) => {
    if (socketRef.current && userRole === 'expert' && !chatPartner) {
      socketRef.current.emit('expert-pick-user', { roomId, userIdToPick: userSocketId });
    }
  };

  const handleEndChat = () => {
    if (socketRef.current && userRole === 'expert' && chatPartner) {
      socketRef.current.emit('expert-end-chat');
    }
    // Users cannot initiate end chat from UI in this model, server/expert does.
  };

  if (showChat) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
          <p>اتاق: {roomId} | شما: {userId} ({userRole})</p>
          {systemMessage && <p style={{ color: chatPartner ? 'green' : 'blue', fontWeight: 'bold' }}>{systemMessage}</p>}
          {userRole === 'user' && queuePosition !== null && !chatPartner && (
            <p>وضعیت شما در صف: {queuePosition}</p>
          )}
        </div>

        <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {userRole === 'expert' && !chatPartner && (
            <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
              <h4>کاربران در صف انتظار</h4>
              {userQueue.length === 0 && <p>هیچ کاربری در صف نیست.</p>}
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {userQueue.map(user => (
                  <li
                    key={user.socketId}
                    onClick={() => handlePickUser(user.socketId)}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      marginBottom: '5px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{user.identifier}</span>
                    <button style={{ padding: '5px 10px', fontSize: '0.8em' }}>شروع چت</button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(chatPartner || (userRole === 'user' && !queuePosition && !systemMessage.includes('صف'))) && (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {chatPartner && (
                <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderBottom: '1px solid #ccc' }}>
                  <p>در حال چت با: <strong>{chatPartner.identifier}</strong> ({chatPartner.role})</p>
                  {userRole === 'expert' && (
                    <button onClick={handleEndChat} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      پایان چت
                    </button>
                  )}
                </div>
              )}
              <WebRTCComponent
                roomId={roomId}
                userId={userId} // This is the identifier
                userRole={userRole}
                socket={socketRef.current} // Pass the main socket instance
                chatPartner={chatPartner} // Pass the current chat partner
                // targetUserIdForAdmin is now handled by chatPartner.id if expert
              />
            </div>
          )}

          {userRole === 'user' && queuePosition !== null && !chatPartner && (
             <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h2>لطفا منتظر بمانید...</h2>
                <p>شما نفر {queuePosition} در صف انتظار هستید.</p>
                <p>{systemMessage}</p>
             </div>
          )}

          {userRole === 'expert' && !chatPartner && userQueue.length === 0 && (
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h2>در انتظار کاربران...</h2>
                <p>در حال حاضر هیچ کاربری در صف انتظار برای اتاق "{roomId}" نیست.</p>
                <p>{systemMessage}</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>WebRTC Text Chat</h1>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="roomId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room ID: </label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="userId" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your User ID: </label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter Your User ID / Name"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="userRole" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Role: </label>
        <select 
          id="userRole" 
          value={userRole} 
          onChange={(e) => setUserRole(e.target.value as 'user' | 'expert')}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', backgroundColor: 'white' }}
        >
          <option value="user">User</option>
          <option value="expert">Expert (Admin)</option>
        </select>
      </div>
      <button 
        onClick={handleJoinRoom} 
        style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        disabled={!roomId.trim() || !userId.trim()}
      >
        Join Room
      </button>
    </div>
  );
};

export default WebRTCChatPage;