// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { createSocketConnection } from "../utils/socket.js";
// import { useSelector } from "react-redux";


// const Chat = () => {


//   const [messages, setMessages] = useState([]);
//   const [newmessage, setNewMessage] = useState("");

//   const { targetUserId } = useParams();
//   const loggedInUser = useSelector((store) => store.user);
//   const userId = loggedInUser?.id;

//   //as soon as the component mounts we want to establish a socket connection and join the appropriate

//   useEffect(() => {
//     if (!userId) return;
//     const socket = createSocketConnection();
//     //  chat room based on the userId and targetUserId. 
//     socket.emit("joinChat", { firstName: loggedInUser.firstName, targetUserId, userId }) // from fe u basically emit the event to join the room be logic will handle the rest
//     //make sure to disconnect the socket when component unmounts to prevent memory leaks and unwanted behavior


//     socket.on("messageReceived", ({ firstName, text }) => {

//       console.log(firstName + ": " + text)
//       setMessages((prev) => [...prev, { firstName, text }])

//     })
//     return () => socket.disconnect();
//   }, [targetUserId, userId])


//   const sendMessage = () => {
//     const socket = createSocketConnection();
//     socket.emit("sendMessage", { loggedInUser.firstName, userId, targetUserId, text: newmessage })
//     setNewMessage("");
//   }

//   return (
//     <div className="w-3/4 mx-auto border border-gray-500 m-5 flex flex-col h-[70vh] rounded-lg">
//       <h1 className="p-5 border-b border-gray-600">Chat</h1>

//       <div className="flex-1 overflow-scroll p-5 space-y-2">
//         {messages.map((msg, index) => (
//           <div key={index} className="chat chat-end">
//             <div className="chat-header">{msg.firstname}</div>
//             <div className="chat-bubble">{msg.text}</div>
//           </div>
//         ))}
//       </div>

//       <div className="p-5 border-t border-gray-700 flex gap-2">
//         <input
//           value={newmessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           className="flex-1 border border-gray-500 p-2 rounded"
//         />
//         <button className="btn btn-secondary" onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;


import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket.js";
import { useSelector } from "react-redux";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newmessage, setNewMessage] = useState("");
  const socketRef = useRef(null);

  const { targetUserId } = useParams();
  const loggedInUser = useSelector((store) => store.user);

  // Determine ID safely without breaking hook order
  const userId = loggedInUser?._id || loggedInUser?.id;

  /**
   * HOOKS MUST BE CALLED FIRST
   * We keep the logic inside the Effect conditional so the Hook itself 
   * always runs in the same order.
   */
  useEffect(() => {
    // Only connect if we have both users
    if (!userId || !targetUserId) return;

    socketRef.current = createSocketConnection();
    const socket = socketRef.current;

    socket.emit("joinChat", { 
      firstName: loggedInUser.firstName, 
      targetUserId, 
      userId 
    });

    socket.on("messageReceived", ({ firstName, text }) => {
      setMessages((prev) => [...prev, { firstName, text }]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [targetUserId, userId, loggedInUser?.firstName]);

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