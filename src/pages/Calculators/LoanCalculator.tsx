import React, { useState, useContext, useEffect } from "react";
import { ImovelContext } from "./context/imovelContext";
import "./calculatorStyles/loanCalculator.css";

interface Parcela {
  mes: number;
  saldoDevedor: number;
  pagamento: number;
  amortizacao: number;
  juros: number;
}

const LoanCalculator: React.FC = () => {
  const imovelContext = useContext(ImovelContext);

  if (!imovelContext) {
    return null; // ou algum fallback
  }

  const { valorImovel, setValorImovel, prazo, setPrazo, pagamento, setPagamento, totalPagamento, setTotalPagamento } = imovelContext;
  const [entrada, setEntrada] = useState<number>(6000);
  const [taxaJuros, setTaxaJuros] = useState<number>(0.8);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(true);

  const financiamento = valorImovel - entrada;
  const amortizacaoMensal = financiamento / prazo;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  let totalPago = 0;
  let totalJuros = 0;

  const gerarTabela = (): Parcela[] => {
    let saldoDevedor = financiamento;
    let tabela: Parcela[] = [];
    for (let mes = 1; mes <= prazo; mes++) {
      const taxaJurosMensal = taxaJuros / 100;
      let juros = saldoDevedor * taxaJurosMensal;
      let pagamentoMensal = amortizacaoMensal + juros;
      saldoDevedor -= amortizacaoMensal;
      totalPago += pagamentoMensal;
      totalJuros += juros;
      tabela.push({
        mes,
        saldoDevedor,
        pagamento: pagamentoMensal,
        amortizacao: amortizacaoMensal,
        juros,
      });
    }
   
    setTotalPagamento(totalPago);

    return tabela;
  };

  useEffect(() => {
    const tabelaFinanciamento = gerarTabela();
    if (tabelaFinanciamento.length > 0) {
      setPagamento(tabelaFinanciamento[0].pagamento); // Definir o valor do primeiro pagamento no contexto
    }
  }, [valorImovel, entrada, taxaJuros, prazo]);

  const tabelaFinanciamento = gerarTabela();

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div className="financiamento-container">
      <h2>Simulador de Financiamento</h2>
      <label>
        Valor do Imóvel:
        <input
          type="number"
          onChange={(e) => setValorImovel(Number(e.target.value))}
          placeholder={formatCurrency(valorImovel)}
        />
      </label>
      <label>
        Entrada:
        <input
          type="number"
          onChange={(e) => setEntrada(Number(e.target.value))}
          placeholder={formatCurrency(entrada)}
        />
      </label>
      <label>
        Taxa de Juros (ao mês):
        <input
          type="number"
          onChange={(e) => setTaxaJuros(Number(e.target.value))}
          placeholder={taxaJuros.toString()}
        />
      </label>
      <label>
        Prazo (meses):
        <input
          type="number"
          onChange={(e) => setPrazo(Number(e.target.value))}
          placeholder={prazo.toString()}
        />
      </label>

      <h3>Resultados:</h3>
      <p>Valor Financiado: {formatCurrency(financiamento)}</p>
      <p>Total a Pagar: {formatCurrency(totalPagamento)}</p>
      <p>Total de Juros: {formatCurrency(totalJuros)}</p>
      <p>Amortização Mensal: {formatCurrency(amortizacaoMensal)}</p>

      <button className="toggle-button" onClick={handleToggleTable}>
        {isTableVisible ? "Ocultar Tabela" : "Mostrar Tabela"}
      </button>

      <div className={`table-container ${isTableVisible ? "visible" : "hidden"}`}>
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
    </div>
  );
};

export default LoanCalculator;