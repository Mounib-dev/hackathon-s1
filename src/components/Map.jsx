import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../axiosConfig'; // Ton instance d'API
import { useNavigate } from 'react-router-dom';


// Assure-toi d'ajouter les styles de Leaflet
import 'leaflet/dist/leaflet.css';

// Configure l'API pour l'authentification
api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const Map = () => {
    const [alerts, setAlerts] = useState([]); // Tableau d'alertes
    const [locations, setLocations] = useState([]); // Tableau des coordonnées correspondantes
    const center = [48.8566, 2.3522]; // Centre de Paris par défaut
    const zoom = 12;
    const navigate = useNavigate();


    // Fonction pour récupérer les alertes depuis le backend
    const fetchAlerts = async () => {
        try {
            const List_alertsEndpoint = "/alert/list";
            const response = await api.get(import.meta.env.VITE_API_BASE_URL + List_alertsEndpoint);
            // console.log(response.data.alerts);
            //  console.log(Array.isArray(response.data.alerts))
            // Vérifie si la réponse est un tableau
            if (Array.isArray(response.data.alerts)) {
                setAlerts(response.data.alerts); // Mise à jour des alertes
            } else {
                console.error('Les données des alertes ne sont pas dans le format attendu.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes:', error);
        }
    };

    // Fonction pour géocoder l'adresse en latitude et longitude
    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();

            // Si une adresse est trouvée, on retourne la première correspondance
            if (data && data.length > 0) {
                return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
            } else {
                console.error('Aucune coordonnée trouvée pour l\'adresse:', address);
                return null;
            }
        } catch (error) {
            console.error('Erreur lors du géocodage de l\'adresse:', error);
            return null;
        }
    };

    // Fonction pour récupérer les alertes et géocoder les adresses
    const processAlerts = async () => {
        const locationsPromises = alerts.map(async (alert) => {
            const address = alert.location; // Adresse à partir de l'alerte
            const coordinates = await geocodeAddress(address);

            // Si des coordonnées sont récupérées, on les retourne avec l'alerte
            if (coordinates) {
                return { ...alert, ...coordinates }; // On combine les informations de l'alerte avec les coordonnées
            }
            return null;
        });

        // Attente de toutes les promesses de géocodage
        const locations = await Promise.all(locationsPromises);

        // Filtrage des alertes qui n'ont pas pu être géocodées
        setLocations(locations.filter(location => location !== null));
        // console.log(locations)
    };

    // Utilisation de useEffect pour récupérer les alertes et traiter les adresses
    useEffect(() => {
        fetchAlerts();
    }, []);

    // Utilisation de useEffect pour traiter les alertes après leur récupération
    useEffect(() => {
        if (alerts.length > 0) {
            processAlerts();
        }
    }, [alerts]); // Cette fonction s'exécute après la mise à jour des alertes
    useEffect(() => {
        //console.log("Locations:", locations); // Vérifie si les coordonnées sont bien là
    }, [locations]);




    return (

        <div className="flex justify-between items-start p-4" >
            <div className="w-1/2 pr-3">
                <MapContainer center={center} zoom={zoom} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={[location.latitude, location.longitude]}
                            icon={L.icon({
                                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                                iconSize: [80, 80], // Taille du marqueur
                                iconAnchor: [12, 41], // Point d'ancrage du marqueur
                                popupAnchor: [0, -41], // Point d'ancrage du popup
                            })}
                        >
                            <Popup>
                                <b>{location.title}</b><br />
                                {location.description}<br />
                                {location.location}

                                {/* Affiche l'adresse aussi */}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            <div className="w-1/2 space-y-3">
                {alerts.map((alert, index) => {
                    let bgColor;

                    // Assign background color based on priority level
                    switch (alert.priorityLevel) {
                        case "faible":
                            bgColor = "bg-yellow-200"; // Yellow for faible
                            break;
                        case "moyen":
                            bgColor = "bg-orange-300"; // Orange for moyen
                            break;
                        case "critique":
                            bgColor = "bg-red-400"; // Red for critique
                            break;
                        default:
                            bgColor = "bg-white"; // Default color if no priority level is set
                    }

                    return (
                        <div key={index} className={`${bgColor}  p-5 rounded-lg shadow-md`}>
                            <h4 className="text-xl font-semibold">{alert.title}</h4>

                            <p className="text-black-500">{alert.location}</p>
                            <button
                                className="bg-pink-500 text-white flex justify-end px-4 py-2 rounded-lg hover:bg-pink-600"
                                onClick={() => navigate(`/chat/${alert.id}`)}
                            >
                                Discussion
                            </button>
                        </div>




                    );



                })}
            </div>
        </div>
    );
};

export default Map;
