import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";

// PAGES
import Financial from "./pages/Financial";
import Home from "./pages/Home";
import Simulator from "./pages/Simulator.tsx";
import InflationGraphic from "./pages/InflationGraphic";
import BudgetSuggestion from "./pages/budgetSuggestion.tsx";
import InCash from "./pages/InCash.tsx";

function App() {
  return (
    <Router basename="/Perini">
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investimento" element={<Simulator />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/grafico" element={<InflationGraphic />} />
          <Route path="/orcamento" element={<BudgetSuggestion />} />
          <Route path="/formadepagamento" element={<InCash />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
