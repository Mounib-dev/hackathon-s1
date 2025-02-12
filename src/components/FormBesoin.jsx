/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

function FormBesoin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priorite, setPriorite] = useState("faible");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulaire soumis:", {
      title,
      description,
      priorite,
      address,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-6 shadow-lg"
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">
        Saisir votre besoin
      </h2>

      <fieldset className="space-y-6">
        {/* Titre */}
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Titre du besoin
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm focus:border-pink-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description du besoin
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32 w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>

        {/* Niveau de priorité */}
        <div>
          <label
            htmlFor="priorite"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Niveau de priorité
          </label>
          <select
            id="priorite"
            name="priorite"
            value={priorite}
            onChange={(e) => setPriorite(e.target.value)}
            className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-pink-500 focus:ring-pink-500"
          >
            <option value="faible">Faible</option>
            <option value="moyen">Moyen</option>
            <option value="critique">Critique</option>
          </select>
        </div>

        {/* Adresse */}
        <div>
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Adresse de l'utilisateur
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-pink-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>

        {/* Bouton de soumission */}
        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-700 focus:ring-4 focus:ring-pink-500"
          >
            Soumettre
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default FormBesoin;
