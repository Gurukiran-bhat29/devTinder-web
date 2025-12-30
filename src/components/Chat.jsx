import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const chatContainerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);

  const fetchChatMessages = async (pageNumber = 1, append = false) => {
    try {
      setLoading(true);
      const chat = await axios.get(
        `${BASE_URL}/chat/${targetUserId}?page=${pageNumber}&limit=50`,
        {
          withCredentials: true,
        }
      );

      console.log(chat.data);

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
        };
      });

      if (append) {
        // Append older messages at the beginning
        setMessages((prev) => [...chatMessages, ...prev]);
      } else {
        // Replace messages (initial load)
        setMessages(chatMessages);
      }

      setHasMore(chat.data.pagination.hasMore);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      
      // Store current scroll height before loading more
      if (chatContainerRef.current) {
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
      }
      
      fetchChatMessages(nextPage, true);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  // Restore scroll position after loading more messages
  useEffect(() => {
    if (page > 1 && chatContainerRef.current) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      chatContainerRef.current.scrollTop = scrollDiff;
    }
  }, [messages]);

  // Handle scroll to detect when user scrolls to top
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      
      // Load more when scrolled near the top (within 100px)
      if (scrollTop < 100 && hasMore && !loading) {
        loadMoreMessages();
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log(firstName + " :  " + text);
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div 
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-scroll p-5"
      >
        {loading && page === 1 && (
          <div className="text-center text-gray-400">Loading messages...</div>
        )}
        
        {hasMore && (
          <div className="text-center mb-4">
            <button
              onClick={loadMoreMessages}
              disabled={loading}
              className="btn btn-sm btn-ghost"
            >
              {loading ? "Loading..." : "Load More Messages"}
            </button>
          </div>
        )}

        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user.firstName === msg.firstName ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time className="text-xs opacity-50"> 2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-white rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};
export default Chat;