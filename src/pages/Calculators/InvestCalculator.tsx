import React, { useState, useContext, useEffect } from "react";
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
  const [reajusteAnual, setReajusteAnual] = useState<number>(0.05);
  const [valeFinanciar, setValeFinanciar] = useState<boolean>(true);

  const { valorImovel, prazo, pagamento, totalPagamento } = imovelContext;

  const quantidadeDisponivel = capacidadeAporte - pagamento;

  const calcularValorFuturo = (PV: number, r: number, n: number, PMT: number): number => {
    const valorFuturo = PV * Math.pow(1 + r, n) + PMT * ((Math.pow(1 + r, n) - 1) / r);
    return valorFuturo;
  };

  const calcularValorizacaoImovel = (valorInicial: number, reajusteAnual: number, prazo: number): number => {
    const reajusteMensal = Math.pow(1 + reajusteAnual, 1 / 12) - 1;
    let valorFinal = valorInicial;
    for (let mes = 1; mes <= prazo; mes++) {
      valorFinal *= 1 + reajusteMensal;
      valorFinal = parseFloat(valorFinal.toFixed(2)); // Arredondar a cada iteração
    }
    return valorFinal;
  };

  useEffect(() => {
    const retornoInvestimento = calcularValorFuturo(qtdInvestida, rentabilidade, prazo, quantidadeDisponivel);
    const valorizacaoImovel = calcularValorizacaoImovel(valorImovel, reajusteAnual, prazo);
    setValeFinanciar(retornoInvestimento > valorizacaoImovel);
  }, [qtdInvestida, rentabilidade, prazo, quantidadeDisponivel, valorImovel, reajusteAnual]);

  const retornoInvestimento = calcularValorFuturo(qtdInvestida, rentabilidade, prazo, quantidadeDisponivel);
  const valorizacaoImovel = calcularValorizacaoImovel(valorImovel, reajusteAnual, prazo);

  const melhorOpcao = retornoInvestimento > valorizacaoImovel ? "ALUGAR" : "FINANCIAR";
  const corOpcao = melhorOpcao === "ALUGAR" ? "#2a9d8f" : "#f4a261";

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
            <td>Disponível para investir</td>
            <td>
              <input
                type="string"
                value={formatCurrency(quantidadeDisponivel)}
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