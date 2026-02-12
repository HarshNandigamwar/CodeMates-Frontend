"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext<any>(null);
export const useSocketContext = () => useContext(SocketContext);
export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (user) {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
        query: { userId: user._id },
      });
      setSocket(socketInstance);
      // Online users ki list receive karna
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
