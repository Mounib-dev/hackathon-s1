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
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/info`,
        );
        setUser({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des infos utilisateur:",
          error,
        );
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
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE_URL}/alert/list`,
        );
        if (Array.isArray(response.data.alerts)) {
          const selectedAlert = response.data.alerts.find(
            (a) => a.id === parseInt(alertId),
          );
          setAlert(selectedAlert || null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      }
    };
    if (alertId) fetchAlertDetails();
  }, [alertId]);

  useEffect(() => {
    const storedMessages =
      JSON.parse(localStorage.getItem(`chat_${alertId}`)) || [];
    setMessages(storedMessages);
  }, [alertId]);

  useEffect(() => {
    if (!socket) return;

    const messageHandler = (newMsg) => {
      console.log(newMsg);
      if (newMsg.alertId === alertId) {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) => msg.createdAt === newMsg.createdAt,
          );
          if (isDuplicate) return prev;
          const updated = [...prev, newMsg];
          localStorage.setItem(`chat_${alertId}`, JSON.stringify(updated));
          return updated;
        });
      }
    };

    socket.on("receiveAlertMessage", messageHandler);
    return () => {
      socket.off("receiveAlertMessage", messageHandler);
    };
  }, [socket, alertId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const senderName = `${user.firstName} ${user.lastName}`.trim() || "Anonyme";

    const newMsg = {
      senderName,
      message: newMessage,
      createdAt: new Date().toISOString(),
      alertId,
    };

    socket.emit("sendAlertMessage", newMsg);
    setNewMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (fullName = "") => {
    return fullName ? fullName.trim().charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="fixed top-0 left-0 flex h-16 w-full items-center bg-pink-600 px-6 py-4 text-white shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 rounded-md bg-white px-3 py-1 text-pink-600 transition-colors hover:bg-gray-200"
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
      <div className="flex justify-center">
        <div className="fixed mt-4 transform animate-pulse rounded-full bg-pink-500 px-4 py-2 text-2xl text-white shadow-lg">
          Cette conversation est éphémère ✨
        </div>
      </div>
      <main className="flex flex-1 items-center justify-center p-4 pt-16">
        <div className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isCurrentUser =
                  msg.senderName === `${user.firstName} ${user.lastName}`;
                return (
                  <div key={index}>
                    {isCurrentUser ? (
                      <div className="flex items-end justify-end space-x-2">
                        <div className="max-w-sm rounded-2xl rounded-br-none bg-pink-500 px-4 py-2 text-white shadow md:max-w-md lg:max-w-lg">
                          <p className="mb-1 text-sm font-semibold">
                            {msg.senderName}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="mt-1 text-right text-xs text-white/80">
                            {dayjs(msg.createdAt).format("DD/MM/YYYY HH:mm")}
                          </p>
                        </div>
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">
                          {getInitials(msg.senderName)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-end justify-start space-x-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white">
                          {getInitials(msg.senderName)}
                        </div>
                        <div className="max-w-sm rounded-2xl rounded-bl-none bg-gray-200 px-4 py-2 text-gray-800 shadow md:max-w-md lg:max-w-lg">
                          <p className="mb-1 text-sm font-semibold">
                            {msg.senderName}
                          </p>
                          <p className="text-sm">{msg.message}</p>
                          <p className="mt-1 text-right text-xs text-gray-600">
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
          <div className="flex border-t border-gray-300 bg-gray-100 p-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Écrire un message..."
              className="flex-1 rounded-l-full border border-gray-300 p-3 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-r-full bg-pink-600 px-4 py-3 text-white transition-colors hover:bg-pink-700"
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
