import { useEffect } from 'react';
export const useSocketEvents = (socket, handler) => {
    useEffect(() => {
        if (!socket) return ;
      Object.entries(handler).forEach(([event, fn]) => {
        socket.on(event, fn);
      });
  
      return () => {
        Object.entries(handler).forEach(([event, fn]) => {
          socket.off(event, fn);
        });
      };
    }, [socket, handler]); // ✅ Prevent repeated attaching
  };