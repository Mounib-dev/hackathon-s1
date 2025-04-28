import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../axiosConfig";
import { FaStar } from "react-icons/fa";

function Volontaires() {
  const [userId, setUserId] = useState(() =>
    Number(localStorage.getItem("userId"))
  );
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [ratedUsers, setRatedUsers] = useState(new Set()); // Pour suivre les volontaires déjà notés

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(
          import.meta.env.VITE_API_BASE_URL + "/user/list"
        );
        // Filtrer les utilisateurs pour exclure l'utilisateur connecté
        const filteredUsers = response.data.filter((u) => u.id !== userId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    };
    fetchUsers();
  }, [user]);

  const handleRating = async (userId, rating) => {
    // Vérifier si l'utilisateur a déjà noté ce volontaire
    if (ratedUsers.has(userId)) {
      alert("Vous avez déjà noté ce volontaire.");
      return;
    }

   
    setRatings((prev) => ({
      ...prev,
      [userId]: rating,
    }));

    try {
      const rate = await api.post(
        import.meta.env.VITE_API_BASE_URL + "/note/create",
        {
          user_id: userId,
          rating: rating,
        }
      );
      console.log(rate);
      
      // Ajouter ce volontaire à la liste des volontaires notés
      setRatedUsers((prev) => new Set(prev).add(userId));
    } catch (error) {
      console.error("Erreur lors de l'envoi de la note", error);
    }
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Liste des Volontaires
      </h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">Aucun volontaire trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-pink-100 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-semibold text-gray-800">
                    {u.firstName} {u.lastName}
                  </h4>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">Noter :</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl transition ${
                        ratings[u.id] >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRating(u.id, star)}
                    />
                  ))}
                </div>
                {ratings[u.id] && (
                  <p className="text-sm text-gray-500 mt-2">
                    Note attribuée : {ratings[u.id]} étoile
                    {ratings[u.id] > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Volontaires;
