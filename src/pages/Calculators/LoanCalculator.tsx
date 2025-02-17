import React, { useState } from "react";

import "./calculatorStyles/loanCalculator.css";

interface Parcela {
  mes: number;
  saldoDevedor: number;
  pagamento: number;
  amortizacao: number;
  juros: number;
}

const LoanCalculator: React.FC = () => {
  const [valorImovel, setValorImovel] = useState<number>(250000);
  const [entrada, setEntrada] = useState<number>(6000);
  const [taxaJuros, setTaxaJuros] = useState<number>(0.008);
  const [prazo, setPrazo] = useState<number>(420);

  const financiamento = valorImovel - entrada;
  const amortizacaoMensal = financiamento / prazo;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  let totalPagamento = 0;
  let totalJuros = 0;

  const gerarTabela = (): Parcela[] => {
    let saldoDevedor = financiamento;
    let tabela: Parcela[] = [];
    for (let mes = 1; mes <= prazo; mes++) {
      let juros = saldoDevedor * taxaJuros;
      let pagamento = amortizacaoMensal + juros;
      saldoDevedor -= amortizacaoMensal;
      totalPagamento += pagamento;
      totalJuros += juros;
      tabela.push({
        mes,
        saldoDevedor,
        pagamento,
        amortizacao: amortizacaoMensal,
        juros,
      });
    }
    return tabela;
  };

  const tabelaFinanciamento = gerarTabela();

  return (
    <div className="financiamento-container">
      <h2>Simulador de Financiamento</h2>
      <label>
        Valor do Imóvel:{" "}
        <input
          type="number"
          value={valorImovel}
          onChange={(e) => setValorImovel(Number(e.target.value))}
        />
      </label>
      <label>
        Entrada:{" "}
        <input
          type="number"
          value={entrada}
          onChange={(e) => setEntrada(Number(e.target.value))}
        />
      </label>
      <label>
        Taxa de Juros (ao mês):{" "}
        <input
          type="number"
          value={taxaJuros}
          step="0.001"
          onChange={(e) => setTaxaJuros(Number(e.target.value))}
        />
      </label>
      <label>
        Prazo (meses):{" "}
        <input
          type="number"
          value={prazo}
          onChange={(e) => setPrazo(Number(e.target.value))}
        />
      </label>

      <h3>Resultados:</h3>
      <p>Valor Financiado: {formatCurrency(financiamento)}</p>
      <p>Total a Pagar: {formatCurrency(totalPagamento)}</p>
      <p>Total de Juros: {formatCurrency(totalJuros)}</p>
      <p>Amortização Mensal: {formatCurrency(amortizacaoMensal)}</p>

      <h3>Tabela de Financiamento</h3>
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Saldo Devedor</th>
            <th>Pagamento</th>
            <th>Amortização</th>
            <th>Juros</th>
          </tr>
        </thead>
        <tbody>
          {tabelaFinanciamento.map(
            ({ mes, saldoDevedor, pagamento, amortizacao, juros }) => (
              <tr key={mes}>
                <td>{mes}</td>
                <td>{formatCurrency(saldoDevedor)}</td>
                <td>{formatCurrency(pagamento)}</td>
                <td>{formatCurrency(amortizacao)}</td>
                <td>{formatCurrency(juros)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoanCalculator;
