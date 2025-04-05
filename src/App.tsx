import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";

//PAGES
import Financial from "./pages/Financial";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator.tsx";


function App() {
  return (
    <div className="container">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/investimento" element={<Simulator />}></Route>
          <Route path="/financial" element={<Financial />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
