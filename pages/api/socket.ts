// pages/api/socket.ts
import { Server as NetServer, Socket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

// Extend NextApiResponse to include the socket property
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// Data structures for the support chat system
// Key: roomId, Value: Array of user socket IDs in the queue for that room
const waitingQueues: Record<string, { socketId: string, identifier: string, joinedAt: number }[]> = {};

// Key: roomId, Value: Array of available expert socket IDs for that room
const availableExpertsPerRoom: Record<string, string[]> = {};

// Key: expertSocketId, Value: userSocketId they are chatting with
const expertChatSessions: Record<string, string> = {};

// Key: userSocketId, Value: expertSocketId they are chatting with
const userChatSessions: Record<string, string> = {};

// Store user details (socket.id -> { identifier, userRole, roomId })
const socketUserDetails: Record<string, { identifier: string, userRole: 'user' | 'expert', roomId: string }> = {};

const MAX_QUEUE_SIZE = 50; // Optional: Limit queue size per room

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new SocketIOServer(res.socket.server as any, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      const emitQueueUpdate = (roomId: string) => {
        const queue = waitingQueues[roomId] || [];
        const serializableQueue = queue.map(u => ({ socketId: u.socketId, identifier: u.identifier }));
        // Emit to all experts in that room
        (availableExpertsPerRoom[roomId] || []).forEach(expertSocketId => {
          io.to(expertSocketId).emit('queue-updated', { roomId, queue: serializableQueue });
        });
        // Also emit to experts currently in session in that room
        Object.keys(expertChatSessions).forEach(expertSocketId => {
          const sessionRoomId = socketUserDetails[expertSocketId]?.roomId;
          if (sessionRoomId === roomId) {
            io.to(expertSocketId).emit('queue-updated', { roomId, queue: serializableQueue });
          }
        });
      };

      const assignUserToExpert = (roomId: string, userSocketId: string, userIdentifier: string) => {
        if (!availableExpertsPerRoom[roomId] || availableExpertsPerRoom[roomId].length === 0) {
          return false; // No expert available
        }
        const expertSocketId = availableExpertsPerRoom[roomId].shift(); // Get first available expert
        if (!expertSocketId) return false;

        expertChatSessions[expertSocketId] = userSocketId;
        userChatSessions[userSocketId] = expertSocketId;

        const expertDetails = socketUserDetails[expertSocketId];
        const userDetails = socketUserDetails[userSocketId];

        io.to(userSocketId).emit('chat-started', { 
          partner: { id: expertSocketId, identifier: expertDetails?.identifier || 'Expert', role: 'expert' }, 
          roomId 
        });
        io.to(expertSocketId).emit('chat-started', { 
          partner: { id: userSocketId, identifier: userDetails?.identifier || 'User', role: 'user' }, 
          roomId 
        });
        
        console.log(`Chat started between expert ${expertSocketId} and user ${userSocketId} in room ${roomId}`);
        // Notify other experts that this expert is busy (implicitly by them not being in availableExpertsPerRoom)
        return true;
      };

      const addUserToQueue = (roomId: string, userSocketId: string, userIdentifier: string) => {
        if (!waitingQueues[roomId]) {
          waitingQueues[roomId] = [];
        }
        if (waitingQueues[roomId].length >= MAX_QUEUE_SIZE) {
          socket.emit('queue-full', { roomId });
          return;
        }
        waitingQueues[roomId].push({ socketId: userSocketId, identifier: userIdentifier, joinedAt: Date.now() });
        const position = waitingQueues[roomId].length;
        socket.emit('added-to-queue', { roomId, position, queueLength: position });
        emitQueueUpdate(roomId);
        console.log(`User ${userSocketId} (${userIdentifier}) added to queue for room ${roomId} at position ${position}`);
      };
      console.log('A user connected:', socket.id);

      socket.on('join-room', (roomId: string, identifier: string, userRole: 'user' | 'expert') => {
        socket.join(roomId);
        socket.data.identifier = identifier; // Use identifier for display name
        socketUserDetails[socket.id] = { identifier, userRole, roomId };
        socket.data.userRole = userRole;
        socket.data.roomId = roomId;

        console.log(`User ${identifier} (${userRole}) (Socket: ${socket.id}) attempting to join room ${roomId}`);

        if (userRole === 'expert') {
          if (!availableExpertsPerRoom[roomId]) {
            availableExpertsPerRoom[roomId] = [];
          }
          if (!availableExpertsPerRoom[roomId].includes(socket.id)) {
             availableExpertsPerRoom[roomId].push(socket.id);
          }
          console.log(`Expert ${identifier} (Socket: ${socket.id}) registered and available for room ${roomId}`);
          socket.emit('expert-registered', { expertId: socket.id, roomId });
          emitQueueUpdate(roomId); // Send current queue state to newly joined expert

          // Check if there are users waiting and assign if possible
          if (waitingQueues[roomId] && waitingQueues[roomId].length > 0) {
            const nextUser = waitingQueues[roomId][0]; // peek
            if (assignUserToExpert(roomId, nextUser.socketId, nextUser.identifier)) {
              waitingQueues[roomId].shift(); // remove if assigned
              emitQueueUpdate(roomId);
            }
          }

        } else if (userRole === 'user') {
          // Try to assign to an expert immediately
          if (!assignUserToExpert(roomId, socket.id, identifier)) {
            // If no expert available, add to queue
            addUserToQueue(roomId, socket.id, identifier);
          }
        }

        // WebRTC signaling should be directed between connected pairs
        // socket.to(roomId).emit('user-joined', socket.id, userRole); // This is too broad now
      });

      socket.on('signal', (data: { to: string; signal: any }) => {
        // Forward signal only if 'to' target exists and they are in a session
        const from = socket.id;
        const to = data.to;
        const fromDetails = socketUserDetails[from];
        const toDetails = socketUserDetails[to];

        // Check if 'from' and 'to' are in a session together
        let inSession = false;
        if (fromDetails?.userRole === 'user' && userChatSessions[from] === to) {
          inSession = true;
        } else if (fromDetails?.userRole === 'expert' && expertChatSessions[from] === to) {
          inSession = true;
        }

        if (inSession && io.sockets.sockets.get(data.to)) {
          io.to(data.to).emit('signal', { signal: data.signal, from: socket.id, fromRole: fromDetails.userRole });
        } else {
          console.log(`Signal target ${data.to} not found or not in session with ${socket.id}.`);
        }
      });

      socket.on('expert-pick-user', (data: { roomId: string, userIdToPick: string }) => {
        const expertSocketId = socket.id;
        const { roomId, userIdToPick } = data;
        const expertDetails = socketUserDetails[expertSocketId];

        if (!expertDetails || expertDetails.userRole !== 'expert') {
          socket.emit('error-message', { message: 'Only experts can pick users.' });
          return;
        }

        if (expertChatSessions[expertSocketId]) {
          socket.emit('error-message', { message: 'You are already in a chat. Please end it first.' });
          return;
        }

        if (!waitingQueues[roomId] || !availableExpertsPerRoom[roomId]) {
            socket.emit('error-message', { message: 'System error or room not initialized.' });
            return;
        }

        const userIndex = (waitingQueues[roomId] || []).findIndex(u => u.socketId === userIdToPick);
        if (userIndex === -1) {
          socket.emit('error-message', { message: 'User not found in queue or already picked.' });
          return;
        }

        const userToConnect = waitingQueues[roomId][userIndex];
        
        // Remove expert from available list
        const expertIndexInAvailable = availableExpertsPerRoom[roomId].indexOf(expertSocketId);
        if (expertIndexInAvailable > -1) {
            availableExpertsPerRoom[roomId].splice(expertIndexInAvailable, 1);
        } else {
            // This case should ideally not happen if logic is correct, means expert was not in available list
            console.warn(`Expert ${expertSocketId} picking user but was not in available list for room ${roomId}`);
        }

        expertChatSessions[expertSocketId] = userToConnect.socketId;
        userChatSessions[userToConnect.socketId] = expertSocketId;
        
        waitingQueues[roomId].splice(userIndex, 1); // Remove user from queue

        const pickedUserDetails = socketUserDetails[userToConnect.socketId];

        io.to(userToConnect.socketId).emit('chat-started', { 
            partner: { id: expertSocketId, identifier: expertDetails.identifier || 'Expert', role: 'expert' }, 
            roomId 
        });
        io.to(expertSocketId).emit('chat-started', { 
            partner: { id: userToConnect.socketId, identifier: pickedUserDetails?.identifier || 'User', role: 'user' }, 
            roomId 
        });

        console.log(`Expert ${expertSocketId} picked user ${userToConnect.socketId} from queue in room ${roomId}`);
        emitQueueUpdate(roomId);
      });

      socket.on('expert-end-chat', () => {
        const expertSocketId = socket.id;
        const expertDetails = socketUserDetails[expertSocketId];

        if (!expertDetails || expertDetails.userRole !== 'expert') {
          socket.emit('error-message', { message: 'Only experts can end chats.' });
          return;
        }

        const userSocketId = expertChatSessions[expertSocketId];
        if (!userSocketId) {
          socket.emit('error-message', { message: 'You are not in an active chat.' });
          return;
        }
        const roomId = expertDetails.roomId;

        io.to(userSocketId).emit('chat-ended', { by: 'expert', message: 'The expert has ended the chat.' });
        socket.emit('chat-ended', { by: 'expert', message: 'You have ended the chat.' });

        delete expertChatSessions[expertSocketId];
        delete userChatSessions[userSocketId];

        if (!availableExpertsPerRoom[roomId]) availableExpertsPerRoom[roomId] = [];
        if (!availableExpertsPerRoom[roomId].includes(expertSocketId)) {
            availableExpertsPerRoom[roomId].push(expertSocketId);
        }
        
        console.log(`Expert ${expertSocketId} ended chat with user ${userSocketId} in room ${roomId}`);

        // Try to assign the now available expert to the next user in queue for that room
        if (waitingQueues[roomId] && waitingQueues[roomId].length > 0) {
          const nextUser = waitingQueues[roomId][0];
          if (assignUserToExpert(roomId, nextUser.socketId, nextUser.identifier)) {
            waitingQueues[roomId].shift();
            emitQueueUpdate(roomId);
          }
        } else {
          // If no one in queue, just update experts that this one is available (implicitly done by adding to list)
          // No specific event needed unless we want to broadcast expert availability status explicitly
        }
      });

      socket.on('send-message', (data: { text: string }) => { // roomId, userId, userRole are in socket.data and socketUserDetails
        const senderSocketId = socket.id;
        const senderDetails = socketUserDetails[senderSocketId];

        if (!senderDetails) {
          console.log(`Message from unknown socket ${senderSocketId}`);
          socket.emit('error-message', {text: 'Cannot send message. User details not found.'});
          return;
        }

        const { roomId, identifier, userRole } = senderDetails;
        const { text } = data;

        const message = {
          id: Date.now().toString(),
          text,
          senderId: senderSocketId, 
          senderIdentifier: identifier, 
          senderRole: userRole,
          timestamp: Date.now(),
          roomId,
        };

        let targetSocketId: string | undefined = undefined;

        if (userRole === 'user') {
          targetSocketId = userChatSessions[senderSocketId];
        } else if (userRole === 'expert') {
          targetSocketId = expertChatSessions[senderSocketId];
        }

        if (targetSocketId && io.sockets.sockets.get(targetSocketId)) {
          console.log(`Message from ${identifier} (${userRole}, ${senderSocketId}) in room ${roomId} to ${targetSocketId}: ${text}`);
          io.to(targetSocketId).emit('receive-message', message);
          socket.emit('receive-message', { ...message, self: true }); // Echo to sender
        } else {
          console.log(`Cannot send message from ${identifier} (${senderSocketId}). No active chat partner found or partner disconnected.`);
          socket.emit('error-message', { text: 'Your chat partner is not available or you are not in an active chat.' });
        }

        
      });

      socket.on('disconnect', () => {
        const disconnectedSocketId = socket.id;
        const userDetails = socketUserDetails[disconnectedSocketId];
        if (!userDetails) {
          console.log('User disconnected:', disconnectedSocketId, 'No details found.');
          return;
        }

        const { identifier, userRole, roomId } = userDetails;
        console.log(`User disconnected: ${identifier} (${userRole}, ${disconnectedSocketId}) from room ${roomId}`);

        if (userRole === 'expert') {
          // Remove expert from available list
          if (availableExpertsPerRoom[roomId]) {
            availableExpertsPerRoom[roomId] = availableExpertsPerRoom[roomId].filter(id => id !== disconnectedSocketId);
          }

          // If expert was in a session
          const chattingWithUserSocketId = expertChatSessions[disconnectedSocketId];
          if (chattingWithUserSocketId) {
            io.to(chattingWithUserSocketId).emit('chat-ended', { by: 'expert-disconnected', message: 'The expert has disconnected. You will be added back to the queue.' });
            delete userChatSessions[chattingWithUserSocketId];
            delete expertChatSessions[disconnectedSocketId];
            
            // Re-queue the user
            const previousUserDetails = socketUserDetails[chattingWithUserSocketId];
            if (previousUserDetails) {
                addUserToQueue(roomId, chattingWithUserSocketId, previousUserDetails.identifier);
            } else {
                console.warn(`Could not re-queue user ${chattingWithUserSocketId} as their details were not found.`);
            }
          }
        } else if (userRole === 'user') {
          // Remove user from queue if they are in it
          if (waitingQueues[roomId]) {
            const userIndexInQueue = waitingQueues[roomId].findIndex(u => u.socketId === disconnectedSocketId);
            if (userIndexInQueue > -1) {
              waitingQueues[roomId].splice(userIndexInQueue, 1);
              emitQueueUpdate(roomId);
            }
          }

          // If user was in a session
          const chattingWithExpertSocketId = userChatSessions[disconnectedSocketId];
          if (chattingWithExpertSocketId) {
            io.to(chattingWithExpertSocketId).emit('chat-ended', { by: 'user-disconnected', message: `User ${identifier} has disconnected.` });
            delete expertChatSessions[chattingWithExpertSocketId];
            delete userChatSessions[disconnectedSocketId];

            // Make the expert available again and try to assign next user
            if (!availableExpertsPerRoom[roomId]) availableExpertsPerRoom[roomId] = [];
            if (!availableExpertsPerRoom[roomId].includes(chattingWithExpertSocketId)) {
                availableExpertsPerRoom[roomId].push(chattingWithExpertSocketId);
            }
            
            if (waitingQueues[roomId] && waitingQueues[roomId].length > 0) {
              const nextUser = waitingQueues[roomId][0];
              if (assignUserToExpert(roomId, nextUser.socketId, nextUser.identifier)) {
                waitingQueues[roomId].shift();
                emitQueueUpdate(roomId);
              }
            }
          }
        }

        delete socketUserDetails[disconnectedSocketId];
        // General cleanup for WebRTC if peers were established - this might need more specific handling
        // io.to(roomId).emit('user-left', disconnectedSocketId, userRole); // This is too broad now
      });
    });
        

    res.socket.server.io = io;
  } else {
    console.log('Socket.io already running');
  }
  res.end();
};

export default ioHandler;