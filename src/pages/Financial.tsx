import "./styles/Financial.css";

//CONTEXT
import { ImovelProvider } from "./Calculators/context/imovelContext";

// CALCULADORAS
import LoanCalculator from "./Calculators/SimuladorDeFinanciamento";
import RentCalculator from "./Calculators/RentCalculator";
import InvestCalculator from "./Calculators/InvestCalculator";

function Financial() {
  return (
    <div className="financialContainer">
      <h1>Aluguel X Financiamento</h1>
      <div className="calculatorContainer">
        <ImovelProvider>
          <LoanCalculator />
          <div>
            <RentCalculator />
            <InvestCalculator />
          </div>
        </ImovelProvider>
      </div>
    </div>
  );
}

export default Financial;
