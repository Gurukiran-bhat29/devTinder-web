import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL, formatTime } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const chatContainerRef = useRef(null);
  const prevScrollHeightRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  const fetchOnlineStatus = async () => {
    try {
      const onlineStatus = await axios.get(
        `${BASE_URL}/user/${targetUserId}/online-status`,
        {
          withCredentials: true,
        }
      );
      const data = onlineStatus.data;
      if (data.isOnline) {
        setIsOnline(data.isOnline);
      } else {
        setLastSeen(data.lastSeenText);
      }
    } catch (err) {
      console.error("Failed to fetch user status:", err);
    }
  };

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
        const { senderId, text, createdAt } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          sentAt: formatTime(createdAt),
        };
      });

      if (append) {
        // Append older messages at the beginning
        setMessages((prev) => [...chatMessages, ...prev]);
        isLoadingMoreRef.current = true;
      } else {
        // Replace messages (initial load)
        setMessages(chatMessages);
        setShouldScrollToBottom(true);
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
    fetchOnlineStatus();
  }, []);

  // Scroll to bottom on initial load or when new message arrives
  useLayoutEffect(() => {
    if (shouldScrollToBottom && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  // Restore scroll position after loading more messages
  useLayoutEffect(() => {
    if (isLoadingMoreRef.current && chatContainerRef.current) {
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      chatContainerRef.current.scrollTop = scrollDiff;
      isLoadingMoreRef.current = false;
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

    // Listen for online/offline events
    socket.on("userOnline", ({ userId }) => {
      console.log("Online event received", userId);
      if (userId === targetUserId) {
        console.log(`User ${userId} is now online`);
        setIsOnline(true);
      }
    });

    socket.on("userOffline", ({ userId, lastSeen }) => {
      console.log("Offline event received", userId);
      if (userId === targetUserId) {
        console.log(`User ${userId} is now offline`);
        setIsOnline(false);
        setLastSeen(lastSeen);
      }
    });

    // As soon as the page loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log(firstName + " :  " + text);
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
      setShouldScrollToBottom(true);
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
    setShouldScrollToBottom(true);
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className="p-5 border-b border-gray-600">
        <span>Chat</span>
        <span className="ml-4 text-sm text-gray-400">
          {isOnline ? "Online" : lastSeen && "Last seen: " + lastSeen}
        </span>
      </div>

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
                <time className="text-xs opacity-50 ml-1">{msg.sentAt}</time>
              </div>
              <div className="chat-bubble">{msg.text}</div>
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
