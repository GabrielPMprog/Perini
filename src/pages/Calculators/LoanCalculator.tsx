import { useState } from "react";
import Finance from "financejs";

import "./calculatorStyles/loanCalculator.css";

function LoanCalculator() {
  const [propertyValue, setPropertyValue] = useState("");
  const [entryValue, setEntryValue] = useState("");
  const [interestAnualRate, setInterestAnualRate] = useState("");
  const [interestMonthRate, setInterestMonthRate] = useState("");
  const [formattedPropertyValue, setFormattedPropertyValue] = useState("");
  const [formattedEntryValue, setFormattedEntryValue] = useState("");
  const [financialValue, setFinancialValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [totalPayment, setTotalPayment] = useState("");
  const [totalInterest, setTotalInterest] = useState("");
  const [totalAmortization, setTotalAmortization] = useState("");

  // const finance = new Finance();

  // TRANSFORMANDO NÚMERO EM MOEDA
  const formatCurrencyMoney = (value: number) => {
    return value.toLocaleString("pt-br", {
      currency: "BRL",
      style: "currency",
    });
  };

  // TRANSFORMANDO NÚMERO EM MOEDA SEM R$
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-br", { minimumFractionDigits: 2 });
  };

  // TRANSFORMANDO NÚMERO EM PORCENTAGEM
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const handlePropertyBlur = () => {
    const numericValue = Number(propertyValue);
    setFormattedPropertyValue(formatCurrency(numericValue));
    updateFinancialValue(numericValue, Number(entryValue));
  };

  const handlePropertyFocus = () => {
    setFormattedPropertyValue(propertyValue);
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPropertyValue(value);
    setFormattedPropertyValue(value);
    updateFinancialValue(Number(value), Number(entryValue));
  };

  const handleEntryBlur = () => {
    const numericValue = Number(entryValue);
    setFormattedEntryValue(formatCurrency(numericValue));
    updateFinancialValue(Number(propertyValue), numericValue);
  };

  const handleEntryFocus = () => {
    setFormattedEntryValue(entryValue);
  };

  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setEntryValue(value);
    setFormattedEntryValue(value);
    updateFinancialValue(Number(propertyValue), Number(value));
  };

  const handleInterestBlur = () => {
    const numericValue = Number(interestAnualRate);
    const monthlyRate = numericValue / 12;
    setInterestMonthRate(formatPercentage(monthlyRate));
    setInterestAnualRate(formatPercentage(numericValue));
  };

  const handleInterestFocus = () => {
    setInterestAnualRate(interestAnualRate.replace("%", ""));
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setInterestAnualRate(value);
    setInterestMonthRate(formatPercentage(Number(value) / 12));
  };

  const handleMonthlyInterestChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setInterestMonthRate(value);
    setInterestAnualRate((Number(value) * 12).toFixed(2));
  };

  const updateFinancialValue = (propertyValue: number, entryValue: number) => {
    const financialValue = propertyValue - entryValue;
    setFinancialValue(financialValue.toString());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setTimeValue(value);
  };

  const calculateResults = () => {
    const P = 244000;  // Valor financiado
    const i = 0.008;   // Taxa de juros mensal (0.80% = 0.008)
    const n = 420;     // Número de meses
    
    const PMT = P * (i / (1 - Math.pow(1 + i, -n)));
    const totalPago = PMT * n;
    const totalJuros = totalPago - P;
    
    console.log("Parcela Mensal (PMT):", PMT.toFixed(2));
    console.log("Total Pago:", totalPago.toFixed(2));
    console.log("Total de Juros:", totalJuros.toFixed(2));
    // setTotalPayment(formatCurrencyMoney(totalPaid));
    // setTotalInterest(formatCurrencyMoney(totalInterestPaid));
    // setTotalAmortization(formatCurrencyMoney(principal));
  };

  return (
    <div className="loanCalculatorContainer">
      <h1>Dados do Financiamento</h1>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Valor do Imóvel
        </label>
        <input
          type="text"
          value={formattedPropertyValue}
          onChange={handlePropertyChange}
          onBlur={handlePropertyBlur}
          onFocus={handlePropertyFocus}
        />
      </div>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Entrada
        </label>
        <input
          type="text"
          value={formattedEntryValue}
          onChange={handleEntryChange}
          onBlur={handleEntryBlur}
          onFocus={handleEntryFocus}
        />
      </div>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Taxa de Juros Anual (%)
        </label>
        <input
          type="text"
          value={interestAnualRate}
          onChange={handleInterestChange}
          onBlur={handleInterestBlur}
          onFocus={handleInterestFocus}
        />
      </div>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Taxa de Juros Mensal (%)
        </label>
        <input
          type="text"
          value={interestMonthRate}
          onChange={handleMonthlyInterestChange}
        />
      </div>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Tempo (meses)
        </label>
        <input type="text" value={timeValue} onChange={handleTimeChange} />
      </div>

      <div className="inputContainer">
        <label htmlFor="" className="inputCalculator">
          {" "}
          Valor do Financiamento{" "}
        </label>
        <input
          type="text"
          value={formatCurrency(Number(financialValue))}
          readOnly
        />
      </div>

      <button onClick={calculateResults}>Calcular</button>

      <h3>Resultados</h3>
      <p>Total a Pagar: {totalPayment}</p>
      <p>Total de Juros: {totalInterest}</p>
      <p>Total de Amortização: {totalAmortization}</p>
    </div>
  );
}

export default LoanCalculator;
