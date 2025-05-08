// socketContext.js
import { createContext, useContext, useMemo, useEffect } from 'react';
import io from 'socket.io-client';

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname
  const parts = pathname.split("/").filter(Boolean)

  const institution = parts[0] || "EduConnect"
  const role = parts[1] || "guest"

  return { institution, role }
}

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const { institution, role } = getInstitutionAndRoleFromPath()
    const socketInstance = io('http://localhost:3000', {
      withCredentials: true,
      query: {
        subdomain: institution,
        role: role,
      },
    });

    return socketInstance;
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket Connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { SocketProvider, useSocket };