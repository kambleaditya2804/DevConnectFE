import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket.js";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store.user);
  const userId = loggedInUser?._id || loggedInUser?.id;

  // FETCH CHAT HISTORY FROM DB
  const fetchChatHistory = async () => {
    try {
      const res = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      // Transform DB messages to match your UI state format
      const history = res?.data?.messages?.map((msg) => ({
        firstName: msg.senderId?.firstName,
        lastName: msg.senderId?.lastName,
        text: msg.text,
      }));

      setMessages(history || []);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };

  useEffect(() => {
    if (!userId || !targetUserId) return;

    // Call the history fetcher
    fetchChatHistory();

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("joinChat", {
      firstName: loggedInUser.firstName,
      targetUserId,
      userId
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [targetUserId, userId]);

  const sendMessage = () => {
    if (!newmessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: loggedInUser.firstName,
      userId,
      targetUserId,
      text: newmessage
    });
    setNewMessage("");
  };

  /**
   * CONDITIONAL RENDERING GOES HERE (AFTER ALL HOOKS)
   */
  if (!loggedInUser) {
    return (
      <div className="w-3/4 mx-auto m-10 text-center">
        <span className="loading loading-dots loading-lg"></span>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-3/4 mx-auto border border-gray-500 m-5 flex flex-col h-[70vh] rounded-lg bg-base-100 shadow-xl">
      <h1 className="p-5 border-b border-gray-600 font-bold text-xl">Chat</h1>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-base-200">
        {messages.map((msg, index) => {
          const isMe = msg.firstName === loggedInUser.firstName;
          return (
            <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
              <div className="chat-header opacity-50 text-xs mb-1">
                {msg.firstName}
              </div>
              <div className={`chat-bubble ${isMe ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-700 flex gap-2">
        <input
          value={newmessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 input input-bordered"
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;