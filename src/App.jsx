import ChatRooms from "./components/chat/ChatRooms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import RegistrationForm from "./components/auth/Register";
import PrivateRoute from "./components/auth/PrivateRoute";
import FormBesoin from "./components/FormBesoin";
import Navbar from "./components/layout/Navbar";
import ChatMiseEnRelation from "./components/chat/ChatMiseEnRelation";

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
              <Route path="/" element={<FormBesoin />} />
              <Route path="/chat" element={<ChatRooms />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
