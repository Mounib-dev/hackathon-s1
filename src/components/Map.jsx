import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../axiosConfig';
import 'leaflet/dist/leaflet.css';
import markerIconRed from '../assets/marker_red.png';
import markerIconOrange from '../assets/marker_orange.png';
import markerIconYellow from '../assets/marker_yellow.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import '../Map.css';

const icons = {
    critique: L.divIcon({
        className: "blinking-icon",
        html: `<img src="${markerIconRed}" style="width:25px; height:41px;">`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    }),
    moyen: L.icon({
        iconUrl: markerIconOrange,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    }),
    faible: L.icon({
        iconUrl: markerIconYellow,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    }),
};

api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const Map = () => {
    const [alerts, setAlerts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const alertsPerPage = 3;

    const center = [48.8566, 2.3522];
    const zoom = 12;
    const navigate = useNavigate();


    const fetchAlerts = async () => {
        try {
            const response = await api.get(import.meta.env.VITE_API_BASE_URL + "/alert/list");
            if (Array.isArray(response.data.alerts)) {
                setAlerts(response.data.alerts);
            } else {
                console.error('Format inattendu des alertes.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes:', error);
        }
    };

    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
            }
            return null;
        } catch (error) {
            console.error('Erreur lors du géocodage:', error);
            return null;
        }
    };

    const processAlerts = async () => {
        const locationsPromises = alerts.map(async (alert) => {
            const coordinates = await geocodeAddress(alert.location);
            return coordinates ? { ...alert, ...coordinates } : null;
        });

        const locations = await Promise.all(locationsPromises);
        setLocations(locations.filter(location => location !== null));
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    useEffect(() => {
        if (alerts.length > 0) {
            processAlerts();
        }
    }, [alerts]);

    useEffect(() => {
        let filtered = alerts;
        if (priorityFilter !== 'all') {
            filtered = alerts.filter(alert => alert.priorityLevel === priorityFilter);
        }
        setFilteredAlerts(filtered);
        setCurrentPage(1);
    }, [priorityFilter, alerts]);

    const lastIndex = currentPage * alertsPerPage;
    const firstIndex = lastIndex - alertsPerPage;
    const currentAlerts = filteredAlerts.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

    const priorityColors = {
        critique: 'bg-red-400',
        moyen: 'bg-orange-300',
        faible: 'bg-yellow-200'
    };

    return (
        <div className="flex flex-row p-4">
            <div className="w-2/3 pr-3">
                <MapContainer center={center} zoom={zoom} style={{ height: '600px', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={[location.latitude, location.longitude]}
                            icon={icons[location.priorityLevel] || icons.faible}
                        >
                            <Popup>
                                <b>{location.title}</b><br />
                                {location.description}<br />
                                {location.location}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            <div className="w-1/3 space-y-3">
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Filtrer par priorité :</label>
                    <select onChange={(e) => setPriorityFilter(e.target.value)} className="border p-2 rounded">
                        <option value="all">Tous</option>
                        <option value="faible">Faible</option>
                        <option value="moyen">Moyen</option>
                        <option value="critique">Critique</option>
                    </select>
                </div>
                {currentAlerts.map((alert, index) => (
                    <div key={index} className={`p-5 rounded-lg shadow-md ${priorityColors[alert.priorityLevel] || 'bg-gray-200'}`}>
                        <h4 className="text-xl font-semibold">{alert.title}</h4>
                        <p className="text-black-500">{alert.location}</p><br></br>
                        <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600">
                            Discussion
                        </button>
                    </div>
                ))}
                <div className="flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-pink-500 text-white' : 'bg-gray-300'}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Map;
