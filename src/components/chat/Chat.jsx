import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../axiosConfig";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const Chat = () => {
  // Récupération de l'ID de l'alerte depuis l'URL
  const { alertId } = useParams(); 
  const navigate = useNavigate();
  
  // États pour stocker les alertes, messages et informations utilisateur
  const [alert, setAlert] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [socket, setSocket] = useState(null);
  
  // Référence pour garder le scroll en bas des messages
  const messagesEndRef = useRef(null); 

  // Connexion au serveur socket lors du montage du composant
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Récupération des informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/user/info`);
        setUser({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des infos utilisateur:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Rejoindre et quitter un salon de chat spécifique en fonction de l'alerte
  useEffect(() => {
    if (socket && alertId) {
      socket.emit("joinAlertRoom", alertId);
      return () => {
        socket.emit("leaveAlertRoom", alertId);
      };
    }
  }, [socket, alertId]);

  // Récupération des détails de l'alerte
  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/alert/list`);
        if (Array.isArray(response.data.alerts)) {
          const selectedAlert = response.data.alerts.find(alert => alert.id === parseInt(alertId));
          setAlert(selectedAlert || null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      }
    };

    if (alertId) fetchAlertDetails();
  }, [alertId]);

  // Chargement des messages stockés en local
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(`chat_${alertId}`)) || [];
    setMessages(storedMessages);
  }, [alertId]);

  // Écoute des nouveaux messages via WebSocket
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMsg) => {
      if (newMsg.alertId === alertId) {
        setMessages((prev) => {
          const isDuplicate = prev.some(msg => msg.createdAt === newMsg.createdAt);
          if (isDuplicate) return prev;

          const updatedMessages = [...prev, newMsg];
          localStorage.setItem(`chat_${alertId}`, JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }
    };

    socket.on("receiveMessage", messageHandler);

    return () => {
      socket.off("receiveMessage", messageHandler);
    };
  }, [socket, alertId]);

  // Fonction pour envoyer un message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      senderName: `${user.firstName} ${user.lastName}`.trim() || "Anonyme",
      message: newMessage,
      createdAt: new Date().toISOString(),
      alertId
    };

    socket.emit("sendMessage", newMsg);
    setNewMessage("");
  };

  // Scroll automatique en bas des messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Barre supérieure avec le titre de l'alerte et le bouton retour */}
      <div className="bg-pink-600 text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate(-1)} className="mr-4 px-2 py-1 rounded-lg bg-white text-pink-600 hover:bg-gray-200">
          ←
        </button>
        {alert ? (
          <div>
            <h2 className="text-lg font-bold">{alert.title}</h2>
            <p className="text-sm opacity-80">{alert.location}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>

      {/* Affichage des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg max-w-xs shadow-md ${
              msg.senderName === `${user.firstName} ${user.lastName}` ? "bg-pink-300 ml-auto text-white" : "bg-white"
            }`}>
              <p className="text-sm font-medium">{msg.senderName}</p>
              <p className="text-black">{msg.message}</p>
              <p className="text-xs text-gray-700 text-right">{dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Aucun message pour le moment.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Champ de saisie du message */}
      <div className="p-4 bg-white shadow-md flex">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none" />
        <button onClick={handleSendMessage} className="px-4 py-3 bg-pink-600 text-white rounded-r-lg hover:bg-pink-700">
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default Chat;
