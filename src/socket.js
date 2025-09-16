import { io } from "socket.io-client";

//connect to backend
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});

export default socket;
