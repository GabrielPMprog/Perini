import { useEffect, useState } from "react";
import "./styles/Financial.css";

// CONTEXT
import { ImovelProvider } from "./Calculators/context/imovelContext";

// CALCULADORAS
import LoanCalculator from "./Calculators/SimuladorDeFinanciamento";
import RentCalculator from "./Calculators/RentCalculator";
import InvestCalculator from "./Calculators/InvestCalculator";

function Financial() {
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
    <div className="financialContainer">
      <div className="calculatorContainer">
        <ImovelProvider>
          <LoanCalculator />
          <div>
            <RentCalculator />
            <InvestCalculator />
          </div>
        </ImovelProvider>
      </div>

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

export default Financial;
