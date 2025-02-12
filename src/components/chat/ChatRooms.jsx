import { useState, useEffect } from "react";
import api from "../../axiosConfig";
import { io } from "socket.io-client";
import dayjs from "dayjs"; 
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale("fr");

const chatRooms = [
  { id: "general", name: "💬 Discussion Générale" },
  { id: "urgence", name: "🚨 Urgences" },
  { id: "entraide", name: "🤝 Entraide Locale" },
  { id: "paris", name: "📍 Paris" },
  { id: "lyon", name: "📍 Lyon" },
];

export default function ChatRooms() {
  const [currentRoom, setCurrentRoom] = useState("general");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    avatar:
      "https://cdn-www.konbini.com/files/2024/11/Chill-guy.jpg?width=3840&quality=75&format=webp",
  });

  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(import.meta.env.VITE_API_BASE_URL + "/user/info");
        const { firstName, lastName } = response.data.user;
        setUser((prevUser) => ({
          ...prevUser,
          firstName: firstName,
          lastName: lastName,
        }));
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des infos utilisateur:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    setMessages([]);
  }, [currentRoom]);

  const sendMessage = () => {
    if (message.trim() || file) {
      const newMessage = {
        username: `${user.firstName} ${user.lastName}`.trim() || "Anonyme",
        avatar: user.avatar,
        message,
        room: currentRoom,
        file: file ? { name: file.name, url: URL.createObjectURL(file), type: file.type } : null,
        timestamp: new Date().toISOString(), 
      };

      socket.emit("sendMessage", newMessage);
      setMessage("");
      setFile(null);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-900 p-4 text-white">
        <h2 className="mb-4 text-xl font-bold">💬 Salons de discussion</h2>
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className={`cursor-pointer rounded-lg p-3 transition ${
                currentRoom === room.id ? "bg-pink-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setCurrentRoom(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-3/4 flex-col p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          {chatRooms.find((r) => r.id === currentRoom)?.name}
        </h2>
        <div className="flex-1 overflow-y-auto rounded-lg border bg-gray-100 p-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="mb-3 flex space-x-3">
                <img
                  src={msg.avatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border shadow"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-600">{msg.username}</span>
                    <span className="text-xs text-gray-500">
                    {dayjs(msg.timestamp).calendar(null, { 
                        sameDay: "[Aujourd’hui à] HH:mm",
                        lastDay: "[Hier à] HH:mm",
                        lastWeek: "dddd [à] HH:mm",
                        sameElse: "DD/MM/YYYY [à] HH:mm",
                      })}

                    </span>
                  </div>
                  <span className="text-gray-700">{msg.message}</span>
                  {msg.file && (
                    <div className="mt-2">
                      {msg.file.type.startsWith("image/") ? (
                        <img
                          src={msg.file.url}
                          alt="shared"
                          className="h-32 w-32 rounded-lg object-cover shadow"
                        />
                      ) : (
                        <a href={msg.file.url} download className="text-blue-500 underline">
                          📎 {msg.file.name}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun message pour l’instant...</p>
          )}
        </div>

        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            className="flex-1 rounded-lg border p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="Écrire un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <input type="file" className="hidden" id="fileInput" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="fileInput" className="cursor-pointer rounded-lg bg-gray-300 px-4 py-3 text-gray-700">
            📎
          </label>
          <button className="rounded-lg bg-pink-600 px-6 py-3 text-white" onClick={sendMessage}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
