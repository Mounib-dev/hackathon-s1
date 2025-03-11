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
  const { alertId } = useParams();
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({ firstName: "", lastName: "" });
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

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

  useEffect(() => {
    if (socket && alertId) {
      socket.emit("joinAlertRoom", alertId);
      return () => {
        socket.emit("leaveAlertRoom", alertId);
      };
    }
  }, [socket, alertId]);

  useEffect(() => {
    const fetchAlertDetails = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE_URL}/alert/list`);
        if (Array.isArray(response.data.alerts)) {
          const selectedAlert = response.data.alerts.find(a => a.id === parseInt(alertId));
          setAlert(selectedAlert || null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      }
    };
    if (alertId) fetchAlertDetails();
  }, [alertId]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(`chat_${alertId}`)) || [];
    setMessages(storedMessages);
  }, [alertId]);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMsg) => {
      if (newMsg.alertId === alertId) {
        setMessages((prev) => {
          const isDuplicate = prev.some(msg => msg.createdAt === newMsg.createdAt);
          if (isDuplicate) return prev;
          const updated = [...prev, newMsg];
          localStorage.setItem(`chat_${alertId}`, JSON.stringify(updated));
          return updated;
        });
      }
    };

    socket.on("receiveMessage", messageHandler);
    return () => {
      socket.off("receiveMessage", messageHandler);
    };
  }, [socket, alertId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const senderName = `${user.firstName} ${user.lastName}`.trim() || "Anonyme";

    const newMsg = {
      senderName,
      message: newMessage,
      createdAt: new Date().toISOString(),
      alertId
    };

    socket.emit("sendMessage", newMsg);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (fullName = "") => {
    return fullName ? fullName.trim().charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    
      <header className="bg-pink-600 text-white px-6 py-4 flex items-center shadow-md fixed top-0 left-0 w-full h-16">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 px-3 py-1 rounded-md bg-white text-pink-600 hover:bg-gray-200 transition-colors"
        >
          ←
        </button>
        {alert ? (
          <div>
            <h2 className="text-lg font-semibold">{alert.title}</h2>
            <p className="text-sm text-pink-100">{alert.location}</p>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </header>


      <main className="pt-16 flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isCurrentUser =
                  msg.senderName === `${user.firstName} ${user.lastName}`;
                return (
                  <div key={index}>
                    {isCurrentUser ? (
                      <div className="flex items-end justify-end space-x-2">
                        <div className="max-w-sm md:max-w-md lg:max-w-lg bg-pink-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
                          <p className="text-sm font-semibold mb-1">
                            {msg.senderName}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-white/80 mt-1 text-right">
                            {dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                        <div className="w-8 h-8 flex-shrink-0 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {getInitials(msg.senderName)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end justify-start space-x-2">
                        <div className="w-8 h-8 flex-shrink-0 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {getInitials(msg.senderName)}
                        </div>
                        <div className="max-w-sm md:max-w-md lg:max-w-lg bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow">
                          <p className="text-sm font-semibold mb-1">
                            {msg.senderName}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="text-xs text-gray-600 mt-1 text-right">
                            {dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400">
                Aucun message pour le moment.
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Champ de saisie */}
          <div className="bg-gray-100 p-3 border-t border-gray-300 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Écrire un message..."
              className="flex-1 p-3 border border-gray-300 rounded-l-full focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-3 bg-pink-600 text-white rounded-r-full hover:bg-pink-700 transition-colors"
            >
              Envoyer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
