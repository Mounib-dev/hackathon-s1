import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import FormBesoin from "./components/Accueil/FormBesoin";

function App() {
  return (
    <>

      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<FormBesoin />}></Route>
        </Routes>
      </Router>

    </>
  );
}

export default App;
