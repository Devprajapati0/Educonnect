import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

function getInstitutionAndRoleFromPath() {
  const pathname = window.location.pathname;
  const parts = pathname.split("/").filter(Boolean);

  const institution = parts[0] || "EduConnect";
  const role = parts[1] || "guest";

  return { institution, role };
}

export const SocketProvider = ({ children }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!currentUser?.token) {
      console.log("Socket NOT initialized: No token");
      return;
    }

    const { institution, role } = getInstitutionAndRoleFromPath();

    // Initiate socket connection
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
      auth: {
        token: currentUser.token,
      },
      query: {
        subdomain: institution,
        role,
        clientId: uuidv4(),
      },
      transports: ["polling"], // Allow websocket and polling transport
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected", newSocket.id);
    });
    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log("🔌 Socket disconnected");
      setSocket(null);
    };
  }, [currentUser?.token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};