import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"], // Ensures only WebSockets are used
  reconnectionAttempts: 5, // Number of retries
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("connect_error", (error) => {
  console.error("Connection failed:", error);
});
