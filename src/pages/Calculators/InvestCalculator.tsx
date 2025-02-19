import React, { useState, useContext } from "react";
import { ImovelContext } from "./context/imovelContext";
import "./calculatorStyles/investCalculator.css";

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const InvestCalculator: React.FC = () => {
  const imovelContext = useContext(ImovelContext);
  if (!imovelContext) {
    return null;
  }

  const [qtdInvestida, setQtdInvestida] = useState<number>(0);
  const [capacidadeAporte, setCapacidadeAporte] = useState<number>(3500);
  const [rentabilidade, setRentabilidade] = useState<number>(0.007);
  const [valeFinanciar, setValeFinanciar] = useState<boolean>(true);

  const {
    valorImovel,
    pagamento,
    totalPagamento,
  } = imovelContext;
  // const [disponivelParaInvestir, setDisponivelParaInvestir] = useState<number>(0);

  
  // let saldoInvestido = qtdInvestida;
  let retornoInvestimento = 0;
  let valorizacaoImovel = valorImovel;
  // const reajusteMensal = Math.pow(1 + reajusteAnual, 1 / 12) - 1;

  const calcularValorFuturo = (
    PV: number,
    r: number,
    n: number,
    PMT: number
  ): number => {
    const valorFuturo =
      PV * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    return valorFuturo;
  };

  const melhorOpcao =
    retornoInvestimento > valorizacaoImovel ? "ALUGAR" : "FINANCIAR";
  const corOpcao = melhorOpcao === "ALUGAR" ? "#2a9d8f" : "#f4a261";

  const disponivelParaInvestir = capacidadeAporte - pagamento;

  return (
    <div className="investContainer">
      <h2>FINANCIAR E INVESTIR</h2>
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
            <td>Valor da Prestação</td>
            <td>
              <input type="number" value={pagamento.toFixed(2)} readOnly />
            </td>
          </tr>
          <tr>
            <td>Disponivel para investir</td>
            <td>
              <input
                type="string"
                value={formatCurrency(disponivelParaInvestir)}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>Pagamento Total</td>
            <td>
              <input
                type="string"
                value={formatCurrency(totalPagamento)}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td>Rentabilidade dos investimentos</td>
            <td>
              <input
                type="number"
                step="0.01"
                value={rentabilidade}
                onChange={(e) => setRentabilidade(Number(e.target.value))}
              />
            </td>
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
            <td>Vale a pena financiar?</td>
            <td
              style={{
                backgroundColor: valeFinanciar ? "#2a9d8f" : "#e63946",
                fontWeight: "bold",
                textAlign: "center",
                color: "white",
              }}
            >
              {valeFinanciar ? "SIM" : "NÃO"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvestCalculator;
