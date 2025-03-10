/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import api from '../axiosConfig';
api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

function FormBesoin() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('accident');
    const [customCategory, setCustomCategory] = useState('');
    const [priorityLevel, setPriorityLevel] = useState('faible');
    const [location, setLocation] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const Create_alertsEndpoint = "/alert/create";
            const response = await api.post(import.meta.env.VITE_API_BASE_URL + Create_alertsEndpoint, {
                title,
                description,
                category: category === 'autre' ? customCategory : category,
                priorityLevel,
                location,
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            console.log(response)

            setTitle('');
            setDescription('');
            setCategory('accident');
            setCustomCategory('');
            setPriorityLevel('faible');
            setLocation('');

            console.log("Le besoin est bien enregistré", response);
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Saisir votre besoin</h2>
                <fieldset className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm"
                        >
                            <option value="urgence">Urgence</option>
                            <option value="Panne">Panne</option>
                            <option value="Accident">Accident</option>
                            <option value="Catastrophe Naturelle">Catastrophe Naturelle</option>
                            <option value="Autre">Autre</option>
                        </select>
                        {category === 'Autre' && (
                            <input
                                type="text"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Entrez une catégorie"
                                className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm mt-2"
                                required
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Titre du besoin</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm"
                            required placeholder='Saisir un titre'
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description du besoin</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm h-32"
                            required placeholder='Saisir une description...'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de priorité</label>
                        <select
                            value={priorityLevel}
                            onChange={(e) => setPriorityLevel(e.target.value)}
                            className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm"
                        >
                            <option value="faible">Faible</option>
                            <option value="moyen">Moyen</option>
                            <option value="critique">Critique</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse de l'utilisateur</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-gray-50 border border-pink-300 rounded-lg w-full px-4 py-2 text-sm"
                            required placeholder='Saisir votre adresse '
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-700">Soumettre</button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

export default FormBesoin;
