import React, { useState, useContext, useEffect } from "react";
import { ImovelContext } from "./context/imovelContext";
import "./calculatorStyles/rentCalculator.css";

const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const parseCurrency = (value: string): number => {
  return Number(value.replace(/\D/g, "")) / 100;
};

const AlugarOuFinanciar: React.FC = () => {
  const imovelContext = useContext(ImovelContext);
  if (!imovelContext) {
    return null;
  }

  const [qtdInvestida, setQtdInvestida] = useState<number>(0);
  const [capacidadeAporte, setCapacidadeAporte] = useState<number>(3500);
  const [valorAluguel, setValorAluguel] = useState<number>(3100);
  const [rendimentoMensal, setRendimentoMensal] = useState<number>(0.7);
  const [reajusteAnual, setReajusteAnual] = useState<number>(5);
  const [consegueFinanciar, setConsegueFinanciar] = useState<boolean>(true);
  const { valorImovel, setValorImovel, prazo, setPrazo } = imovelContext;

  const [retornoInvestimento, setRetornoInvestimento] = useState<number>(0);
  const [valorizacaoImovel, setValorizacaoImovel] = useState<number>(valorImovel);
  const [melhorOpcao, setMelhorOpcao] = useState<string>("");
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState<number>(0);

  const calcularValorizacaoExata = (
    valorInicial: number,
    taxaAnual: number,
    meses: number
  ): number => {
    const taxaMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
    let valorFinal = valorInicial;
  
    for (let mes = 1; mes <= meses; mes++) {
      if (mes > 12) {
        valorFinal *= (1 + taxaMensal);
      }
    }
  
    return parseFloat(valorFinal.toFixed(2));
  };
  useEffect(() => {
    calcularResultados();
  }, [qtdInvestida, capacidadeAporte, valorAluguel, rendimentoMensal, reajusteAnual, prazo, valorImovel]);

  const calcularResultados = () => {
    const disponivel = capacidadeAporte - valorAluguel;
    setQuantidadeDisponivel(disponivel);

    // 1. Cálculo do Retorno dos Investimentos
    let saldoInvestido = qtdInvestida;
    const taxaMensalInvest = rendimentoMensal / 100;
    
    for (let mes = 1; mes <= prazo; mes++) {
      saldoInvestido = saldoInvestido * (1 + taxaMensalInvest) + disponivel;
    }
    setRetornoInvestimento(parseFloat(saldoInvestido.toFixed(2)));

    // 2. Cálculo da Valorização do Imóvel com taxa ajustada
    const valorizacao = calcularValorizacaoExata(valorImovel, reajusteAnual, prazo);
    setValorizacaoImovel(parseFloat(valorizacao.toFixed(2)));

    

    // 3. Determinação da melhor opção
    setMelhorOpcao(saldoInvestido > valorizacao ? "ALUGAR" : "FINANCIAR");
  };

  const corOpcao = melhorOpcao === "ALUGAR" ? "#afc74e" : "#da1616";

  return (
    <div className="rentContainer">
      <h2>ALUGAR OU FINANCIAR?</h2>
      <table>
        <tbody>
          <tr>
            <td>Quantidade Investida</td>
            <td>
              <input
                type="text"
                value={formatCurrency(qtdInvestida)}
                onChange={(e) => setQtdInvestida(parseCurrency(e.target.value))}
                onBlur={(e) => setQtdInvestida(parseCurrency(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Capacidade de Aporte</td>
            <td>
              <input
                type="text"
                value={formatCurrency(capacidadeAporte)}
                onChange={(e) => setCapacidadeAporte(parseCurrency(e.target.value))}
                onBlur={(e) => setCapacidadeAporte(parseCurrency(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Valor do Aluguel</td>
            <td>
              <input
                type="text"
                value={formatCurrency(valorAluguel)}
                onChange={(e) => setValorAluguel(parseCurrency(e.target.value))}
                onBlur={(e) => setValorAluguel(parseCurrency(e.target.value))}
              />
            </td>
          </tr>
          <tr>
            <td>Rentabilidade dos Investimentos (mês)</td>
            <td className="rendimentoMensalInput">
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
          {/* <tr>
            <td>Valor do Imóvel</td>
            <td>
              <input
                type="text"
                value={formatCurrency(valorImovel)}
                onChange={(e) => setValorImovel(parseCurrency(e.target.value))}
                onBlur={(e) => setValorImovel(parseCurrency(e.target.value))}
              />
            </td>
          </tr> */}
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
            <td style={{
              backgroundColor: consegueFinanciar ? "#afc74e" : "#da1616",
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
            }}>
              {consegueFinanciar ? "SIM" : "NÃO"}
            </td>
          </tr>
          <tr>
            <td>Alugar ou Financiar?</td>
            <td style={{
              backgroundColor: corOpcao,
              fontWeight: "bold",
              textAlign: "center",
              color: "white",
            }}>
              {melhorOpcao}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AlugarOuFinanciar;