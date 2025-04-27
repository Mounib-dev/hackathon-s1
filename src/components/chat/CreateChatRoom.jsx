import { useState } from "react";
import { Plus, CircleX } from "lucide-react";
import api from "../../axiosConfig";
import PropTypes from "prop-types";

const icons = ["💬", "🚨", "🤝", "📍"]; // Available icons

const CreateChatRoom = ({ onAddChatRoom }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(icons[0]); // Default icon

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const createChatRoomEndpoint = "/chatroom/create";
    const response = await api.post(
      import.meta.env.VITE_API_BASE_URL + createChatRoomEndpoint,
      {
        name,
        icon,
      },
    );
    console.log(response);
    if (response.status === 201) {
      onAddChatRoom({
        id: response.data.chatRoomId,
        name: `${icon} ${name}`,
      });

      setOpen(false);
      setName("");
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-white shadow-md transition-all hover:bg-pink-700"
      >
        <Plus />
        Ajouter un salon
      </button>

      {/* Modal */}
      {open && (
        <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-pink-400">
          <div className="w-80 rounded-lg bg-white p-6 shadow-lg">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h2 className="text-lg font-bold text-pink-600">
                Créer un salon
              </h2>
              <CircleX
                onClick={() => setOpen(false)}
                className="text-pink-600"
              />
            </div>

            {/* Input Field for Chatroom Name */}
            <input
              type="text"
              placeholder="Nom du salon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400"
            />

            {/* Select Dropdown for Icons */}
            <select
              onChange={(e) => setIcon(e.target.value)}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-gray-100 p-2 text-gray-700 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-400"
            >
              {icons.map((ic, index) => (
                <option key={index} value={ic}>
                  {ic}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-4 w-full rounded-lg bg-pink-600 py-2 text-white transition-all hover:bg-pink-700"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </>
  );
};
CreateChatRoom.propTypes = {
  onAddChatRoom: PropTypes.func.isRequired,
};

export default CreateChatRoom;
