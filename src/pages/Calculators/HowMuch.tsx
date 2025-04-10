import { useState } from "react";
import "./calculatorStyles/HowMuch.css";

type InvestimentoProps = {
  rentabilidadeAnual: number;
  inflacaoAnual: number;
  rentabilidadeReal: number;
  valorInicial: number;
  valorDesejado: number;
  tempoMeses: number;
  aporteNecessario: number;
};

export default function HowMuch() {
  const [dados, setDados] = useState<InvestimentoProps>({
    rentabilidadeAnual: 12.15,
    inflacaoAnual: 5,
    rentabilidadeReal: 0,
    valorInicial: 0,
    valorDesejado: 1000000,
    tempoMeses: 480,
    aporteNecessario: 0,
  });

  const [editandoValorInicial, setEditandoValorInicial] = useState(false);
  const [editandoValorDesejado, setEditandoValorDesejado] = useState(false);

  const [tabela, setTabela] = useState<
    Array<{
      mes: number;
      valorInicial: number;
      aporte: number;
      juros: number;
      total: number;
    }>
  >([]);

  const [mostrarTabela, setMostrarTabela] = useState(true);

  function calcularAporteComPMT() {
    const rentabilidadeMensal =
      Math.pow(1 + dados.rentabilidadeAnual / 100, 1 / 12) - 1;

    // Calcula a taxa mensal de inflação
    const inflacaoMensal = Math.pow(1 + dados.inflacaoAnual / 100, 1 / 12) - 1;

    // Calcula a rentabilidade real mensal
    const rentabilidadeRealMensal =
      (1 + rentabilidadeMensal) / (1 + inflacaoMensal) - 1;

    const valorDesejado = dados.valorDesejado;
    const valorInicial = dados.valorInicial;
    const periodoMeses = dados.tempoMeses;
    const taxaMensal = rentabilidadeRealMensal;

    // Fórmula correta para calcular o PMT para valor futuro
    const pmt =
      (valorDesejado - valorInicial * Math.pow(1 + taxaMensal, periodoMeses)) *
      (taxaMensal / (Math.pow(1 + taxaMensal, periodoMeses) - 1));

    // Cálculo da tabela de amortização
    let saldo = valorInicial;
    let novaTabela = [];

    for (let mes = 1; mes <= periodoMeses; mes++) {
      const juros = saldo * taxaMensal;
      const aporte = Math.abs(pmt);
      saldo += aporte + juros;

      novaTabela.push({
        mes,
        valorInicial: saldo - aporte - juros,
        aporte: aporte,
        juros,
        total: saldo,
      });
    }

    setDados((prev) => ({
      ...prev,
      rentabilidadeReal: parseFloat((rentabilidadeRealMensal * 100).toFixed(5)),
      aporteNecessario: parseFloat(Math.abs(pmt).toFixed(2)),
    }));

    setTabela(novaTabela);
    setMostrarTabela(true);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDados((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  }

  function formatarParaReal(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function desformatarReal(valor: string): number {
    return (
      Number(
        valor
          .replace(/\s/g, "")
          .replace("R$", "")
          .replace(/\./g, "")
          .replace(",", ".")
      ) || 0
    );
  }

  return (
    <div className="investirContainer p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">
        Quanto Investir para Chegar a 1 Milhão
      </h2>
      <div>
        <label>Valor Inicial:</label>
        <input
          type="text"
          name="valorInicial"
          value={
            editandoValorInicial
              ? dados.valorInicial
              : formatarParaReal(dados.valorInicial)
          }
          onFocus={() => setEditandoValorInicial(true)}
          onBlur={() => setEditandoValorInicial(false)}
          onChange={(e) =>
            setDados((prev) => ({
              ...prev,
              valorInicial: desformatarReal(e.target.value),
            }))
          }
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label>Rentabilidade Anual (%):</label>
        <input
          type="number"
          name="rentabilidadeAnual"
          value={dados.rentabilidadeAnual}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label>Inflação Anual (%):</label>
        <input
          type="number"
          name="inflacaoAnual"
          value={dados.inflacaoAnual}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label>Valor Desejado:</label>
        <input
          type="text"
          name="valorDesejado"
          value={
            editandoValorDesejado
              ? dados.valorDesejado
              : formatarParaReal(dados.valorDesejado)
          }
          onFocus={() => setEditandoValorDesejado(true)}
          onBlur={() => setEditandoValorDesejado(false)}
          onChange={(e) =>
            setDados((prev) => ({
              ...prev,
              valorDesejado: desformatarReal(e.target.value),
            }))
          }
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label>Tempo (meses):</label>
        <input
          type="number"
          name="tempoMeses"
          value={dados.tempoMeses}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <button onClick={calcularAporteComPMT} className="calculateButton">
        Calcular
      </button>

      {dados.aporteNecessario > 0 && (
        <>
          <div className="resultsContainer">
            <h3 className="font-semibold">Resultados:</h3>
            <p className="text-lg font-bold">
              Valor Desejado Ajustado:{" "}
              {formatarParaReal(
                dados.valorDesejado *
                  Math.pow(1 + dados.inflacaoAnual / 100, dados.tempoMeses / 12)
              )}
            </p>
            <p className="text-md">
              Aporte Mensal Necessário:{" "}
              {formatarParaReal(dados.aporteNecessario)}
            </p>
          </div>
          <button
            onClick={() => setMostrarTabela((prev) => !prev)}
            className="toggleButton"
          >
            {mostrarTabela ? "Ocultar Tabela" : "Mostrar Tabela"}
          </button>
        </>
      )}

      <div className={`tabela-container ${mostrarTabela ? "" : "oculta"}`}>
        {tabela.length > 0 && (
          <table className="mt-4 w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="classListTable border border-gray-300 p-2">
                  Mês
                </th>
                <th className="classListTable border border-gray-300 p-2">
                  Valor Inicial
                </th>
                <th className="classListTable border border-gray-300 p-2">
                  Aporte
                </th>
                <th className="classListTable border border-gray-300 p-2">
                  Juros
                </th>
                <th className="classListTable border border-gray-300 p-2">
                  Total Acumulado
                </th>
              </tr>
            </thead>
            <tbody>
              {tabela.map((linha) => (
                <tr key={linha.mes} className="text-center">
                  <td className="border border-gray-300 p-2">{linha.mes}</td>
                  <td className="border border-gray-300 p-2">
                    {formatarParaReal(linha.valorInicial)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatarParaReal(linha.aporte)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatarParaReal(linha.juros)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatarParaReal(linha.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
