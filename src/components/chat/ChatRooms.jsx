import { useState, useEffect } from "react";
import api from "../../axiosConfig";

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
    avatar: "https://cdn-www.konbini.com/files/2024/11/Chill-guy.jpg?width=3840&quality=75&format=webp",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {

      const userInfoEndpoint = "/user/info"
      try {
        const response = await api.get(import.meta.env.VITE_API_BASE_URL + userInfoEndpoint);
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
        file: null,
      };

      if (file) {
        const fileUrl = URL.createObjectURL(file);
        newMessage.file = { name: file.name, url: fileUrl, type: file.type };
      }

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setFile(null);
    }
  };

  return (
    
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">💬 Salons de discussion</h2>
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className={`p-3 rounded-lg cursor-pointer transition ${
                currentRoom === room.id ? "bg-pink-600" : "hover:bg-gray-700"
              }`}
              onClick={() => setCurrentRoom(room.id)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {chatRooms.find((r) => r.id === currentRoom)?.name}
        </h2>
        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-100">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="mb-3 flex items-center space-x-3">
                <img src={msg.avatar} alt="Avatar" className="w-10 h-10 rounded-full border shadow" />
                <div>
                  <span className="font-semibold text-blue-600">{msg.username}:</span>
                  <span className="ml-2 text-gray-700">{msg.message}</span>
                  {msg.file && (
                    <div className="mt-2">
                      {msg.file.type.startsWith("image/") ? (
                        <img src={msg.file.url} alt="shared" className="w-32 h-32 object-cover rounded-lg shadow" />
                      ) : (
                        <a href={msg.file.url} download className="text-blue-500 underline">
                          Télécharger le fichier
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

        <div className="flex mt-4 space-x-2">
          <input
            type="text"
            className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Écrire un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <input type="file" className="hidden" id="fileInput" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="fileInput" className="bg-gray-300 text-gray-700 px-4 py-3 rounded-lg cursor-pointer">
            📎
          </label>
          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg" onClick={sendMessage}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
