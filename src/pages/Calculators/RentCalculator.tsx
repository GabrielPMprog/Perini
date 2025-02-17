import React, { useState } from "react";
import "./calculatorStyles/rentCalculator.css";

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const AlugarOuFinanciar: React.FC = () => {
  const [capacidadeAporte, setCapacidadeAporte] = useState<number>(3500);
  const [valorAluguel, setValorAluguel] = useState<number>(3100);
  const [rendimentoMensal, setRendimentoMensal] = useState<number>(0.007);
  const [reajusteAnual, setReajusteAnual] = useState<number>(0.05);
  const [valorImovel, setValorImovel] = useState<number>(250000);

  const quantidadeDisponivel = capacidadeAporte - valorAluguel;
  let saldoInvestido = 0;
  let retornoInvestimento = 0;
  let valorizacaoImovel = valorImovel;

  for (let ano = 1; ano <= 35; ano++) {
    saldoInvestido *= 1 + rendimentoMensal * 12;
    saldoInvestido += quantidadeDisponivel * 12;
    retornoInvestimento = saldoInvestido;
    valorizacaoImovel *= 1 + reajusteAnual;
  }

  const melhorOpcao = retornoInvestimento > valorizacaoImovel ? "ALUGAR" : "FINANCIAR";
  const corOpcao = melhorOpcao === "ALUGAR" ? "#2a9d8f" : "#f4a261";

  return (
    <div className="rentContainer">
      <h2 className="title">ALUGAR OU FINANCIAR?</h2>
      <table className="finance-table">
        <tbody>
          <tr>
            <td>Capacidade de Aporte</td>
            <td>
              <input
                type="number"
                value={capacidadeAporte}
                onChange={(e) => setCapacidadeAporte(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Valor do Aluguel</td>
            <td>
              <input
                type="number"
                value={valorAluguel}
                onChange={(e) => setValorAluguel(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Rentabilidade dos Investimentos (mês)</td>
            <td>
              <input
                type="number"
                step="0.001"
                value={rendimentoMensal}
                onChange={(e) => setRendimentoMensal(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Reajuste do Imóvel (anual)</td>
            <td>
              <input
                type="number"
                step="0.01"
                value={reajusteAnual}
                onChange={(e) => setReajusteAnual(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Valor do Imóvel</td>
            <td>
              <input
                type="number"
                value={valorImovel}
                onChange={(e) => setValorImovel(Number(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Quantidade disponível para investir</td>
            <td>{formatCurrency(quantidadeDisponivel)}</td>
          </tr>
          <tr>
            <td>Retorno dos Investimentos</td>
            <td>{formatCurrency(retornoInvestimento)}</td>
          </tr>
          <tr>
            <td>Valorização do Imóvel</td>
            <td>{formatCurrency(valorizacaoImovel)}</td>
          </tr>
          <tr>
            <td>Alugar ou Financiar?</td>
            <td className="decision" style={{ backgroundColor: corOpcao }}>{melhorOpcao}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlugarOuFinanciar;
