import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export default function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const listenToNotifications = (callback) => {
    if (!socket) return;
    socket.on("notification", callback);
  };

  const listenToMessages = (callback) => {
    if (!socket) return;
    socket.on("message", callback);
  };

  const sendMessage = (data) => {
    if (socket) {
      socket.emit("message", data);
    }
  };

  return {
    socket,
    listenToNotifications,
    listenToMessages,
    sendMessage,
  };
}