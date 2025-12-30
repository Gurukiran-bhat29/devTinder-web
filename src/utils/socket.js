import io from "socket.io-client";
import { BASE_URL } from "./constants";

// https://socket.io/docs/v4/client-options/#auth

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true, // Sends cookies automatically 
    });
  } else {
    return io("/", { 
      path: "/api/socket.io",
      withCredentials: true, // Sends cookies automatically
     });
  }
};