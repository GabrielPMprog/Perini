import { useState } from "react";

function LoanCalculator() {
  const [propertyValue, setPropertyValue] = useState("");

  // TRANSFORMANDO NÚMERO EM MOEDA
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-br", { minimumFractionDigits: 2 });
  };

  const handleBlur = () => {
    setPropertyValue(formatCurrency(Number(propertyValue)));
  };

  const handleFocus = () => {
    setPropertyValue(propertyValue.replace(/\D/g, ""));
  };

  return (
    <div className="loanCalculatorContainer">
      <h1>Dados do Financiamento</h1>

      <label htmlFor=""> Valor do Imóvel</label>
      <input
        type="text"
        value={propertyValue}
        onChange={(e) => setPropertyValue(e.target.value)}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />

      <h3>Resultados</h3>
      {/* <p>{ formatCurrency(Number(propertyValue))}</p> */}
    </div>
  );
}

export default LoanCalculator;