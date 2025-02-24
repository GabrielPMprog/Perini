import React, { useState, useContext } from "react";
import { ImovelContext } from "./context/imovelContext";
import "./calculatorStyles/rentCalculator.css";

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const AlugarOuFinanciar: React.FC = () => {
  const imovelContext = useContext(ImovelContext);
  if (!imovelContext) {
    return null;
  }

  const [qtdInvestida, setQtdInvestida] = useState<number>(0);
  const [capacidadeAporte, setCapacidadeAporte] = useState<number>(3500);
  const [valorAluguel, setValorAluguel] = useState<number>(3100);
  const [rendimentoMensal, setRendimentoMensal] = useState<number>(0.007);
  const [reajusteAnual, setReajusteAnual] = useState<number>(0.05);
  const [consegueFinanciar, setConsegueFinanciar] = useState<boolean>(true);
  const { valorImovel, setValorImovel, prazo, setPrazo } = imovelContext;

  const quantidadeDisponivel = capacidadeAporte - valorAluguel;
  let saldoInvestido = qtdInvestida;
  let retornoInvestimento = 0;
  let valorizacaoImovel = valorImovel;
  const reajusteMensal = Math.pow(1 + reajusteAnual, 1 / 12) - 1;

  for (let mes = 1; mes <= prazo; mes++) {
    saldoInvestido *= 1 + rendimentoMensal;
    saldoInvestido += quantidadeDisponivel;
    saldoInvestido = parseFloat(saldoInvestido.toFixed(2)); // Arredondar a cada iteração
    retornoInvestimento = saldoInvestido;
    valorizacaoImovel *= 1 + reajusteMensal;
    valorizacaoImovel = parseFloat(valorizacaoImovel.toFixed(2)); // Arredondar a cada iteração
  }

  const melhorOpcao = retornoInvestimento > valorizacaoImovel ? "ALUGAR" : "FINANCIAR";
  const corOpcao = melhorOpcao === "ALUGAR" ? "#2a9d8f" : "#f4a261";

  return (
    <div className="rentContainer">
      <h2>ALUGAR OU FINANCIAR?</h2>
      <table>
        <tbody>
          <tr>
            <td>Quantidade Investida</td>
            <td>
              <input
                type="number"
                value={qtdInvestida}
                onChange={(e) => setQtdInvestida(Number(e.target.value))}
              />
            </td>
          </tr>
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
            <td>Prazo (meses)</td>
            <td>
              <input
                type="number"
                value={prazo}
                onChange={(e) => setPrazo(Number(e.target.value))}
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
            <td>Você consegue financiar?</td>
            <td style={{ backgroundColor: consegueFinanciar ? "#2a9d8f" : "#e63946", fontWeight: "bold", textAlign: "center", color: "white" }}>
              {consegueFinanciar ? "SIM" : "NÃO"}
            </td>
          </tr>
          <tr>
            <td>Alugar ou Financiar?</td>
            <td style={{ backgroundColor: corOpcao, fontWeight: "bold", textAlign: "center", color: "white" }}>{melhorOpcao}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlugarOuFinanciar;