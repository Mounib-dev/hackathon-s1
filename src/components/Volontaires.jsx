import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../axiosConfig";
import { FaStar } from "react-icons/fa";

function Volontaires() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
   
    const fetchUsers = async () => {
        const response = await api.get(import.meta.env.VITE_API_BASE_URL + "/user/list"); 
        setUsers(response.data);
          
              
  
    };
   
    fetchUsers();
  }, [user]);



  const handleRating = (userId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [userId]: rating,
    }));
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
                    Note attribuée : {ratings[u.id]} étoile{ratings[u.id] > 1 ? "s" : ""}
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
