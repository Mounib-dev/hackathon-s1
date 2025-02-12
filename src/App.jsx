import ChatRooms from "./components/chat/ChatRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import RegistrationForm from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import FormBesoin from "./components/FormBesoin";
import Navbar from "./components/layout/Navbar";
import ChatMiseEnRelation from "./components/chat/ChatMiseEnRelation";

import { NotificationProvider } from "./context/NotitificationContext";

function App() {
  return (
    <>
      <Router>
        <NotificationProvider>
          <AuthProvider>
            <Navbar />

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<FormBesoin />} />
              </Route>
            </Routes>
          </AuthProvider>
        </NotificationProvider>
      </Router>
    </>
  );
}

export default App;
