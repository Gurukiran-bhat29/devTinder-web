import io from "socket.io-client";
import { BASE_URL } from "./constants";

// export const createSocketConnection = () => {
//        return io(BASE_URL, {
//    });
//    return io(BASE_URL, {
//      withCredentials: true, // This sends cookies automatically
//    });
// };

// https://socket.io/docs/v4/client-options/#auth

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  } else {
    return io("/", { path: "/api/socket.io" });
  }
};