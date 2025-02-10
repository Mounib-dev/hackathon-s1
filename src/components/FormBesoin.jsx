/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';

function FormBesoin() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priorite, setPriorite] = useState('faible');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulaire soumis:', {
            title,
            description,
            priorite,
            address,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Saisir votre besoin</h2>

            <fieldset className="space-y-6">
                {/* Titre */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Titre du besoin
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-50 border border-pink-300 rounded-lg focus:border-pink-500 w-full px-4 py-2 text-sm"
                        required />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description du besoin
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-50 border border-pink-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 w-full px-4 py-2 text-sm text-gray-700 h-32"
                        required
                    />
                </div>

                {/* Niveau de priorité */}
                <div>
                    <label htmlFor="priorite" className="block text-sm font-medium text-gray-700 mb-2">
                        Niveau de priorité
                    </label>
                    <select
                        id="priorite"
                        name="priorite"
                        value={priorite}
                        onChange={(e) => setPriorite(e.target.value)}
                        className="bg-gray-50 border border-pink-300 rounded-lg 
                        focus:ring-pink-500 focus:border-pink-500 
                        w-full px-4 py-2 text-sm text-gray-700"
                    >
                        <option value="faible">Faible</option>
                        <option value="moyen">Moyen</option>
                        <option value="critique">Critique</option>
                    </select>
                </div>

                {/* Adresse */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse de l'utilisateur
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-gray-50 border border-pink-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 w-full px-4 py-2 text-sm text-gray-700"
                        required
                    />
                </div>

                {/* Bouton de soumission */}
                <div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-700 focus:ring-4 focus:ring-pink-500"
                    >
                        Soumettre
                    </button>
                </div>
            </fieldset>
        </form>
    );
}

export default FormBesoin;
