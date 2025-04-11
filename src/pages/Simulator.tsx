import { useEffect, useState } from "react";
import Milion from "./Calculators/Milion";
import Inflation from "./Calculators/Inflation";
import HowMuch from "./Calculators/HowMuch";

import './styles/Simulator.css';

export default function Simulator() {
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setMostrarBotaoTopo(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rolarParaTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mainSimulatorContainer">
      <Milion />
      <Inflation />
      <HowMuch />

      {mostrarBotaoTopo && (
        <button
          onClick={rolarParaTopo}
          className="botao-voltar-topo"
          aria-label="Voltar ao topo"
        >
          ↑
        </button>
      )}
    </div>
  );
}
