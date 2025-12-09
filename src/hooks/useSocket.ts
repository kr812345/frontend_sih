import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the backend Socket.IO server
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || "http://localhost:5000";
    socket.current = io(SOCKET_URL);

    socket.current.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.current?.id);
    });

    socket.current.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return socket;
}
