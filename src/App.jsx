import ChatRooms from "./components/chat/ChatRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import RegistrationForm from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import FormBesoin from "./components/FormBesoin";
import Map from "./components/Map";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
// import ChatMiseEnRelation from "./components/chat/ChatMiseEnRelation";
import Chat from "./components/chat/Chat";

import ChatBot from "./components/chat/ChatBot";
import Volontaires from "./components/Volontaires";


function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Router>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/chat" element={<ChatRooms />} />
                  <Route path="/chat/:alertId" element={<Chat />} />
                  <Route path="/" element={<Map />} />
                  <Route path="/nouvelle-demande" element={<FormBesoin />} />
                  <Route path="/ai-assistant" element={<ChatBot />} />
                  <Route path="/volontaires" element={<Volontaires />} />
                 

                  
                </Route>
              </Routes>
            </main>
          </AuthProvider>
        </Router>
        <Footer />
      </div>
    </>
  );
}

export default App;
