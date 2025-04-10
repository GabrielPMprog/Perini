import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./calculatorStyles/BudgetSuggestionCalc.css";

interface Breakdown {
  categoria: string;
  percentual: number;
  cor: string;
}

const categorias: Breakdown[] = [
  { categoria: "Necessidades Básicas", percentual: 55, cor: "#00796B" },
  { categoria: "Liberdade Financeira", percentual: 10, cor: "#6A1B9A" },
  { categoria: "Longo Prazo", percentual: 10, cor: "#D7B46A" },
  { categoria: "Educação", percentual: 10, cor: "#4CAF50" },
  { categoria: "Lazer", percentual: 10, cor: "#F06292" },
  { categoria: "Colchão Financeiro", percentual: 5, cor: "#E57373" },
];

const BudgetSuggestionCalc: React.FC = () => {
  const [salario, setSalario] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");

  const formatCurrency = (valor: number) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Remove tudo que não for número
    const numericValue = rawValue.replace(/\D/g, "");

    // Converte para número em reais (com centavos)
    const valueInReais = parseFloat(numericValue) / 100;

    setSalario(valueInReais);
    setInputValue(
      valueInReais.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
  };

  const data = categorias.map(({ categoria, percentual, cor }) => ({
    name: categoria,
    value: +(salario * (percentual / 100)).toFixed(2),
    fill: cor,
  }));

  return (
    <main className="budget-container">
  <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
    Planejador Financeiro Mensal
  </h2>

  <label style={{ display: "block", marginBottom: "1rem" }}>
  <span>Quanto você ganha por mês?</span>
  <input
    type="text"
    value={inputValue}
    onChange={handleInputChange}
    className="budget-input"
    placeholder="R$ 0,00"
    style={{
      display: "block",
      marginTop: 8,
      padding: 10,
      width: "100%",
      borderRadius: 8,
      border: "1px solid #ccc",
      fontSize: 16,
    }}
  />
</label>

{/* RESULTADOS EM TEXTO */}
<div className="budget-results">
  <h3>Distribuição sugerida:</h3>
  {data.map(({ name, value }) => (
    <div key={name} className="budget-result-item">
      {name}: <strong>{formatCurrency(value)}</strong>
    </div>
  ))}
</div>

{/* GRÁFICO EM TELAS MAIORES */}
<div className="pie-chart-wrapper pie-chart">
  <ResponsiveContainer width="100%" height={500} className="pie-chart">
  <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 40 }} className="pie-chart">
    <Pie
      dataKey="value"
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={120}
      className="pie-chart"
      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
    >
      {data.map((entry, index) => (
        <Cell key={index} fill={entry.fill} />
      ))}
    </Pie>
    <Tooltip
      formatter={(value: number) => formatCurrency(Number(value))}
    />
    <Legend
      layout="horizontal"
      verticalAlign="bottom"
      align="center"
      className="legendPie"
    />
  </PieChart>
</ResponsiveContainer>
  </div>
</main>
  );
};

export default BudgetSuggestionCalc;
