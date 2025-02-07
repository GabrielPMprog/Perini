import './styles/Financial.css';

// CALCULADORAS
import LoanCalculator from "./Calculators/LoanCalculator";
import RentCalculator from './Calculators/RentCalculator';

function Financial() {
  return (
    <div className="financialContainer">
      <h1>Aluguel X Financiamento</h1>
      <div className="calculatorContainer">
      <LoanCalculator />
      <RentCalculator />
      </div>
    </div>
  );
}

export default Financial;
