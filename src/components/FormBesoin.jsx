/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
api.defaults.headers.common["Authorization"] =
  `Bearer ${localStorage.getItem("token")}`;

function FormBesoin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("accident");
  const [customCategory, setCustomCategory] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("faible");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const Create_alertsEndpoint = "/alert/create";
      const response = await api.post(
        import.meta.env.VITE_API_BASE_URL + Create_alertsEndpoint,
        {
          title,
          description,
          category: category === "autre" ? customCategory : category,
          priorityLevel,
          location,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      console.log(response);

      setTitle("");
      setDescription("");
      setCategory("accident");
      setCustomCategory("");
      setPriorityLevel("faible");
      setLocation("");
      navigate("/");

      console.log("Le besoin est bien enregistré", response);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          Saisir votre besoin
        </h2>
        <fieldset className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
            >
              <option value="urgence">Urgence</option>
              <option value="Panne">Panne</option>
              <option value="Accident">Accident</option>
              <option value="Catastrophe Naturelle">
                Catastrophe Naturelle
              </option>
              <option value="Autre">Autre</option>
            </select>
            {category === "Autre" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Entrez une catégorie"
                className="mt-2 w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
                required
              />
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Titre du besoin
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
              required
              placeholder="Saisir un titre"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description du besoin
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32 w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
              required
              placeholder="Saisir une description..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Niveau de priorité
            </label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
            >
              <option value="faible">Faible</option>
              <option value="moyen">Moyen</option>
              <option value="critique">Critique</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Adresse de l'utilisateur
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm"
              required
              placeholder="Saisir votre adresse "
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-700"
            >
              Soumettre
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default FormBesoin;
