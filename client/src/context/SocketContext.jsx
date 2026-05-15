import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * SocketProvider maintains a single Socket.IO connection for the app lifetime.
 * Components call useSocket() to access:
 *  - socket: the socket instance
 *  - connected: boolean connection status
 *  - on(event, cb): subscribe to a real-time event
 *  - off(event, cb): unsubscribe
 */
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const on = useCallback((event, callback) => {
    if (socket) socket.on(event, callback);
  }, [socket]);

  const off = useCallback((event, callback) => {
    if (socket) socket.off(event, callback);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connected, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
