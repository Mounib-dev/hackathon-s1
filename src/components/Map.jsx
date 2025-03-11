import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import api from "../axiosConfig";
import "leaflet/dist/leaflet.css";
import markerIconRed from "../assets/marker_red.png";
import markerIconOrange from "../assets/marker_orange.png";
import markerIconYellow from "../assets/marker_yellow.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../Map.css";
import { useNavigate } from "react-router-dom";
import { CircleX, Loader2 } from "lucide-react";

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

const Map = () => {
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const alertsPerPage = 3;
  const navigate = useNavigate();

  const center = [48.8566, 2.3522];
  const [mapCenter, setMapCenter] = useState(center);

  const zoom = 12;

  const mapRef = useRef(null);

  const centerMapOnAlert = (alertId) => {
    const alert = locations.find((loc) => loc.id === alertId);
    if (alert && mapRef.current) {
      mapRef.current.setView([alert.latitude, alert.longitude], 12);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get(
        import.meta.env.VITE_API_BASE_URL + "/alert/list",
      );
      if (Array.isArray(response.data.alerts)) {
        setAlerts(response.data.alerts);
      } else {
        console.error("Format inattendu des alertes.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors du géocodage:", error);
      return null;
    }
  };

  const processAlerts = async () => {
    const locationsPromises = alerts.map(async (alert) => {
      const coordinates = await geocodeAddress(alert.location);
      return coordinates ? { ...alert, ...coordinates } : null;
    });

    const locations = await Promise.all(locationsPromises);
    setLocations(locations.filter((location) => location !== null));
  };

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");

  const handleOpenPopup = async (alert) => {
    console.log(alert);
    setLoading(true);
    setSelectedAlert(alert);
    const assistantEndpoint = "/ai-assistant/advice";
    const aiAdvice = await api.post(
      import.meta.env.VITE_API_BASE_URL + assistantEndpoint,
      {
        title: alert.title,
        category: alert.category,
        description: alert.description,
        priority: alert.priorityLevel,
      },
    );
    console.log(aiAdvice);
    if (aiAdvice.status === 200) {
      setAdvice(aiAdvice.data.response);
      setLoading(false);
    }
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
    if (priorityFilter !== "all") {
      filtered = alerts.filter(
        (alert) => alert.priorityLevel === priorityFilter,
      );
    }
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [priorityFilter, alerts]);

  const lastIndex = currentPage * alertsPerPage;
  const firstIndex = lastIndex - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage);

  const priorityColors = {
    critique: "bg-red-500",
    moyen: "bg-orange-500",
    faible: "bg-yellow-300",
  };

  return (
    <div className="flex flex-row p-4">
      <div className="w-2/3 pr-3">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "600px", width: "100%" }}
          ref={mapRef}
        >
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
                <b>{location.title}</b>
                <br />
                {location.description}
                <br />
                {location.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="w-1/3 space-y-3">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Filtrer par priorité :</label>
          <select
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded border p-2"
          >
            <option value="all">Tous</option>
            <option value="faible">Faible</option>
            <option value="moyen">Moyen</option>
            <option value="critique">Critique</option>
          </select>
        </div>
        {currentAlerts.map((alert, index) => (
          <div key={index} className={`rounded-lg p-4 shadow-md`}>
            <div className="flex">
              <div
                className={`my-auto h-2 rounded-full ${priorityColors[alert.priorityLevel] || "bg-gray-200"} animate-pulse p-1.5`}
              ></div>
              <h4 className="mb-1 ml-3 text-xl font-semibold">{alert.title}</h4>
            </div>

            <p className="text-black-500">{alert.location}</p>
            <br />
            <div className="flex space-x-2">
              <button
                className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
                onClick={() => navigate(`/chat/${alert.id}`)}
              >
                Discussion
              </button>
              <button
                className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
                onClick={() => centerMapOnAlert(alert.id)}
              >
                Localiser
              </button>
              <button
                className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
                onClick={() => handleOpenPopup(alert)}
              >
                Conseils
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`rounded px-3 py-1 ${currentPage === i + 1 ? "bg-pink-500 text-white" : "bg-gray-300"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      {selectedAlert && (
        <div className="fixed inset-y-0 right-0 flex max-h-screen w-1/3 flex-col overflow-y-auto rounded-l-lg border-l border-gray-300 bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold">Conseils utiles</h3>

          <button
            className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white"
            onClick={() => setSelectedAlert(null)}
          >
            <CircleX className="text-red-600" />
          </button>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              <span className="ml-2">Chargement en cours...</span>
            </div>
          ) : (
            <>
              <p>
                Voici quelques conseils pouvant vous aider dans votre situation
                en attendant une aide ou intervention :
              </p>
              <br />
              <div>{advice}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Map;
