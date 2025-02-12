import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import api from "../../axiosConfig";

const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, { autoConnect: false });

export default function ChatMiseEnRelation() {
  const [alerts, setAlerts] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ firstName: "", lastName: "", avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png" });

  useEffect(() => {
    socket.connect();
    
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/user/info");
        const { firstName, lastName } = response.data.user;
        setUser({ firstName, lastName, avatar: user.avatar });
      } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        username: `${user.firstName} ${user.lastName}`.trim() || "Anonyme",
        avatar: user.avatar,
        message,
        alertId: currentAlert?.id,
      };
      
      socket.emit("send_message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">🚨 Choisissez une alerte </h2>
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className={`p-3 rounded-lg cursor-pointer transition ${currentAlert?.id === alert.id ? "bg-pink-600" : "hover:bg-gray-700"}`}
              onClick={() => setCurrentAlert(alert)}
            >
              {alert.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentAlert ? `🆘 ${currentAlert.title}` : "Alerte en cours"}
        </h2>
        <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-gray-100">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="mb-3 flex items-center space-x-3">
                <img src={msg.avatar} alt="Avatar" className="w-10 h-10 rounded-full border shadow" />
                <div>
                  <span className="font-semibold text-dark-600">{msg.username}:</span>
                  <span className="ml-2 text-gray-700">{msg.message}</span>
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
          <button className="bg-pink-600 text-white px-6 py-3 rounded-lg" onClick={sendMessage}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
