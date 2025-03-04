import ChatRooms from "./components/chat/ChatRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import RegistrationForm from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import FormBesoin from "./components/FormBesoin";
import Map from "./components/Map";
import Navbar from "./components/layout/Navbar";
import Chat from "./components/chat/Chat";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route element={<PrivateRoute />}>

              <Route path="/chat" element={<ChatRooms />} />
              <Route path="/chat/:alertId" element={<Chat />} />
              <Route path="/" element={<Map />} />
              <Route path="/nouvelle-demande" element={<FormBesoin />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
