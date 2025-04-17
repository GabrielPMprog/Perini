import React, { useState, useContext, useEffect } from "react";
import { ImovelContext } from "./context/imovelContext";
import "./calculatorStyles/loanCalculator.css";

import { FaInfoCircle } from "react-icons/fa";

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
    return null;
  }

  const {
    valorImovel,
    setValorImovel,
    prazo,
    setPrazo,
    pagamento,
    setPagamento,
    totalPagamento,
    setTotalPagamento,
  } = imovelContext;

  const [entrada, setEntrada] = useState<number>(6000);
  const [taxaJuros, setTaxaJuros] = useState<number>(0.8);
  const [isTableVisible, setIsTableVisible] = useState<boolean>(true);
  const [tabelaFinanciamento, setTabelaFinanciamento] = useState<Parcela[]>([]);

  const financiamento = valorImovel - entrada;
  const amortizacaoMensal = financiamento / prazo;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrency = (value: string): number => {
    return Number(value.replace(/\D/g, "")) / 100;
  };

  useEffect(() => {
    const gerarTabela = (): Parcela[] => {
      let saldoDevedor = financiamento;
      const novaTabela: Parcela[] = [];
      let totalPago = 0;
      let totalJuros = 0;

      for (let mes = 1; mes <= prazo; mes++) {
        const taxaJurosMensal = taxaJuros / 100;
        const juros = saldoDevedor * taxaJurosMensal;
        const pagamentoMensal = amortizacaoMensal + juros;
        saldoDevedor -= amortizacaoMensal;

        totalPago += pagamentoMensal;
        totalJuros += juros;

        novaTabela.push({
          mes,
          saldoDevedor: saldoDevedor < 0 ? 0 : saldoDevedor,
          pagamento: pagamentoMensal,
          amortizacao: amortizacaoMensal,
          juros,
        });
      }

      setTotalPagamento(Number(totalPago.toFixed(2)));
      if (novaTabela.length > 0) {
        setPagamento(Number(novaTabela[0].pagamento.toFixed(2)));
      }
      return novaTabela;
    };

    const novaTabela = gerarTabela();
    setTabelaFinanciamento(novaTabela);
  }, [valorImovel, entrada, taxaJuros, prazo]);

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  const totalJuros = tabelaFinanciamento.reduce((acc, parcela) => acc + parcela.juros, 0);

  return (
    <div className="financiamento-container">
      <h2>SIMULADOR DE FINANCIAMENTO</h2>

      <label>
        Valor do Imóvel:
        <input
          type="text"
          value={formatCurrency(valorImovel)}
          onChange={(e) => setValorImovel(parseCurrency(e.target.value))}
          onBlur={(e) => setValorImovel(parseCurrency(e.target.value))}
        />
      </label>

      <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      <label>
        Entrada:
  <input
    type="text"
    value={formatCurrency(entrada)}
    onChange={(e) => setEntrada(parseCurrency(e.target.value))}
    onBlur={(e) => setEntrada(parseCurrency(e.target.value))}
    style={{ width: "100%", paddingRight: "30px" }} // espaço pro ícone
  />
  <button
    onClick={() => {
      const valorSugerido = valorImovel * 0.2;
      setEntrada(valorSugerido);
    }}
    title="O valor geralmente é de 20% da valorização do imóvel"
    style={{
      position: "absolute",
      right: "8px",
      top: "68%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      margin: 0,
      color: "#afc74e",
    }}
  >
    <FaInfoCircle size={16} />
  </button>
  </label> 
</div>

      <label>
        Taxa de Juros (ao mês):
        <input
          type="number"
          value={taxaJuros}
          onChange={(e) => setTaxaJuros(Number(e.target.value))}
        />
      </label>

      <label>
        Prazo (meses):
        <input
          type="number"
          value={prazo}
          onChange={(e) => setPrazo(Number(e.target.value))}
        />
      </label>

      <h3>Resultados:</h3>
      <p>Total a Pagar: {formatCurrency(totalPagamento)}</p>
      <p>Total de Juros: {formatCurrency(totalJuros)}</p>
      <p>Valor Financiado: {formatCurrency(financiamento)}</p>
      <p>Amortização Mensal: {formatCurrency(amortizacaoMensal)}</p>

      <button className="toggle-button" onClick={handleToggleTable}>
        {isTableVisible ? "Ocultar Tabela" : "Mostrar Tabela"}
      </button>

      {isTableVisible && (
        <div className="table-container visible">
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
                  <tr key={mes} className="loanTableResult">
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
      )}
    </div>
  );
};

export default LoanCalculator;
