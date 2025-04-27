import { useState, useEffect } from "react";
import api from "../../axiosConfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import "dayjs/locale/fr";

// Configuration des extensions de Day.js pour la gestion des dates
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale("fr");

// Importation de socket.io-client pour gérer la communication en temps réel
import { io } from "socket.io-client";
import CreateChatRoom from "./CreateChatRoom";

// Définition des différentes salles de discussion disponibles
// const chatRooms = [
//   { id: "general", name: "💬 Discussion Générale" },
//   { id: "urgence", name: "🚨 Urgences" },
//   { id: "entraide", name: "🤝 Entraide Locale" },
//   { id: "paris", name: "📍 Paris" },
//   { id: "lyon", name: "📍 Lyon" },
// ];

export default function ChatRooms() {
  // Gestion de la salle courante, des messages, du champ d'entrée et des fichiers
  const [currentRoom, setCurrentRoom] = useState("");
  const [cannotSendMessages, setCannotSendMessages] = useState(true);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    id: null,
    avatar:
      "https://cdn-www.konbini.com/files/2024/11/Chill-guy.jpg?width=3840&quality=75&format=webp",
  });

  // Chat Rooms
  const [chatRooms, setChatRooms] = useState([]);

  const addChatRoom = (newRoom) => {
    console.log("New Room: ", newRoom);
    setChatRooms([...chatRooms, newRoom]);
  };

  // État pour gérer l'image zoomée (affichée en grand)
  const [zoomImage, setZoomImage] = useState(null);

  // Connexion au serveur WebSocket
  const socket = io("http://localhost:3000");

  // Écoute des messages entrants en temps réel, avec filtrage par salle et dédoublonnage
  useEffect(() => {
    // const messageHandler = (newMessage) => {
    //   console.log(newMessage);
    //   // Filtres uniquement les messages destinés à la salle courante
    //   // if (newMessage.room !== currentRoom) return;
    //   setMessages((prevMessages) => {
    //     // Vérifier si le message existe déjà dans la liste ( via son timestamp)
    //     if (
    //       prevMessages.some((msg) => msg.timestamp === newMessage.timestamp)
    //     ) {
    //       return prevMessages;
    //     }
    //     const updatedMessages = [...prevMessages, newMessage];
    //     // Sauvegarde des messages dans le localStorage pour persistance
    //     localStorage.setItem(
    //       `chatMessages_${newMessage.room}`,
    //       JSON.stringify(updatedMessages),
    //     );
    //     return updatedMessages;
    //   });
    // };

    if (currentRoom !== "") {
      socket.emit("joinRoom", currentRoom);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [currentRoom]);

  // Récupération des informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get(
          import.meta.env.VITE_API_BASE_URL + "/user/info",
        );
        const { firstName, lastName, id } = response.data.user;
        setUser((prevUser) => ({ ...prevUser, firstName, lastName, id }));
      } catch (error) {
        console.error(
          "❌ Erreur lors de la récupération des infos utilisateur:",
          error,
        );
      }
    };

    fetchUserInfo();
  }, []);

  // ADD "ENTRAIN D'ÉCRIRE for other users while someone is writing"
  // MAKE SURE TO RETRIEVE ONLY SOME DATA OF USER NOT HIS PASSWORD AND SO ON...
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Current Room: ", currentRoom);
        const response = await api.get(
          import.meta.env.VITE_API_BASE_URL +
            `/chatroom/messages/${currentRoom}`,
        );
        console.log(response.status);
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("❌ Error fetching messages:", error);
      }
    };

    if (currentRoom !== "") {
      fetchMessages();
    }
  }, [currentRoom]);

  // Retrieve chat rooms from Database
  useEffect(() => {
    const fetchChatRooms = async () => {
      const chatRoomsEndpoint = "/chatroom/list";
      const response = await api.get(
        import.meta.env.VITE_API_BASE_URL + chatRoomsEndpoint,
      );
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200 && response.data.length > 0) {
        console.log(response.data);
        setChatRooms([...response.data]);
      }
    };

    fetchChatRooms();
  }, []);

  const sendMessage = async () => {
    if (message.trim() || file) {
      const newMessage = {
        text: message,
        fileUrl: file ? URL.createObjectURL(file) : null,
        userId: user.id,
        roomId: currentRoom,
      };

      try {
        const response = await api.post(
          import.meta.env.VITE_API_BASE_URL + "/chatroom/messages/",
          newMessage,
        );
        socket.emit("sendMessage", response.data);
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }

      setMessage("");
      setFile(null);
    }
  };

  // LEGACY v v v v v (BELOW)
  // Fonction d'envoi d'un message (texte ou fichier)
  // const sendMessage = () => {
  //   if (message.trim() || file) {
  //     const newMessage = {
  //       username: `${user.firstName} ${user.lastName}`.trim() || "Anonyme",
  //       avatar: user.avatar,
  //       message,
  //       room: currentRoom,

  //       // Ici, on utilise URL.createObjectURL(file) qui ne fonctionne que localement.
  //       file: file
  //         ? { name: file.name, url: URL.createObjectURL(file), type: file.type }
  //         : null,
  //       timestamp: new Date().toISOString(),
  //     };

  //     // Émission du message au serveur via WebSocket
  //     socket.emit("sendMessage", newMessage);

  //     setMessages((prevMessages) => {
  //       // Vérifie s'il y a déjà un message avec ce timestamp
  //       if (
  //         prevMessages.some((msg) => msg.timestamp === newMessage.timestamp)
  //       ) {
  //         return prevMessages;
  //       }
  //       const updatedMessages = [...prevMessages, newMessage];
  //       localStorage.setItem(
  //         `chatMessages_${currentRoom}`,
  //         JSON.stringify(updatedMessages),
  //       );
  //       return updatedMessages;
  //     });

  //     // Réinitialisation des champs après envoi
  //     setMessage("");
  //     setFile(null);
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Liste des salons de discussion */}
      <div className="w-1/4 bg-gray-900 p-4 text-white">
        <h2 className="mb-4 text-xl font-bold">💬 Salons de discussion</h2>
        <div className="mt-6">
          <CreateChatRoom onAddChatRoom={addChatRoom} />
        </div>
        <ul className="space-y-2">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              className={`cursor-pointer rounded-lg p-3 transition ${
                currentRoom === room.id ? "bg-pink-600" : "hover:bg-gray-700"
              }`}
              onClick={() => {
                setCurrentRoom(room.id);
                setCannotSendMessages(false);
              }}
            >
              {room.icon}
              <span className="ml-3">{room.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Zone principale du chat */}
      <div className="flex w-3/4 flex-col p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          {chatRooms.find((r) => r.id === currentRoom)?.name}
        </h2>

        {/* Liste des messages */}
        <div className="flex-1 overflow-y-auto rounded-lg border bg-gray-100 p-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="mb-3 flex space-x-3">
                {/* <img
                  src={msg.avatar}
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border shadow"
                /> */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-600">
                      {msg.user.firstName} {msg.user.lastName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {dayjs(msg.createdAt).calendar(null, {
                        sameDay: "[Aujourd’hui à] HH:mm",
                        lastDay: "[Hier à] HH:mm",
                        lastWeek: "dddd [à] HH:mm",
                        sameElse: "DD/MM/YYYY [à] HH:mm",
                      })}
                    </span>
                  </div>
                  <span className="text-gray-700">{msg.text}</span>

                  {/* Si c'est un fichier image, on l'affiche en miniature et on peut zoomer */}
                  {msg.file && msg.file.type.startsWith("image/") && (
                    <div className="mt-2">
                      <img
                        src={msg.file.url}
                        alt="shared"
                        className="h-32 w-32 cursor-pointer rounded-lg object-cover shadow"
                        // Au clic, on affiche l'image en grand dans une modale
                        onClick={() => setZoomImage(msg.file.url)}
                      />
                    </div>
                  )}

                  {/* Sinon, si c'est un autre type de fichier, on propose le téléchargement */}
                  {msg.file && !msg.file.type.startsWith("image/") && (
                    <div className="mt-2">
                      <a
                        href={msg.file.url}
                        download
                        className="text-blue-500 underline"
                      >
                        📎 {msg.file.name}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              {cannotSendMessages
                ? "Sélectionnez un salon pour commencer à discuter."
                : "Aucun message pour l’instant..."}
            </p>
          )}
        </div>

        {/* Zone de saisie du message */}
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            className="flex-1 rounded-lg border p-3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="Écrire un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <input
            type="file"
            className="hidden"
            id="fileInput"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer rounded-lg bg-gray-300 px-4 py-3 text-gray-700"
          >
            📎
          </label>
          <button
            className={`rounded-lg px-6 py-3 text-white transition-colors ${cannotSendMessages ? "cursor-not-allowed bg-gray-400" : "bg-pink-600 hover:bg-pink-700"}`}
            onClick={sendMessage}
            disabled={cannotSendMessages}
          >
            Envoyer
          </button>
        </div>
      </div>

      {/* Modale pour zoomer sur l'image au premier plan */}
      {zoomImage && (
        <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
          {/* On clique en dehors de l'image pour fermer */}
          <div
            className="absolute inset-0"
            onClick={() => setZoomImage(null)}
          />
          <div className="relative">
            <img
              src={zoomImage}
              alt="Zoomed"
              className="max-h-screen max-w-full rounded shadow-lg"
            />
            {/* Bouton de fermeture en haut à droite de l'image */}
            <button
              className="absolute top-2 right-2 rounded bg-gray-800 px-3 py-1 text-white"
              onClick={() => setZoomImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
