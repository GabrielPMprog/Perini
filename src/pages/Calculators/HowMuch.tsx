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

  const [tabela, setTabela] = useState<
    Array<{
      mes: number;
      valorInicial: number;
      aporte: number;
      juros: number;
      total: number;
    }>
  >([]);

  const [mostrarTabela, setMostrarTabela] = useState(true); // 👈 novo estado

  function calcularAporteCrescente() {
    const rentabilidadeMensal =
      Math.pow(1 + dados.rentabilidadeAnual / 100, 1 / 12) - 1;
    const inflacaoMensal = Math.pow(1 + dados.inflacaoAnual / 100, 1 / 12) - 1;
    const rentabilidadeReal =
      (1 + rentabilidadeMensal) / (1 + inflacaoMensal) - 1;

    const valorDesejadoAjustado =
      dados.valorDesejado * Math.pow(1 + inflacaoMensal, dados.tempoMeses);

    let aporteInicial =
      (valorDesejadoAjustado -
        dados.valorInicial *
          Math.pow(1 + rentabilidadeMensal, dados.tempoMeses)) /
      (((Math.pow(1 + rentabilidadeMensal, dados.tempoMeses) - 1) /
        rentabilidadeMensal) *
        (1 + inflacaoMensal));

    let total = dados.valorInicial;
    let novaTabela = [];

    for (let mes = 1; mes <= dados.tempoMeses; mes++) {
      let aporte = aporteInicial * Math.pow(1 + inflacaoMensal, mes);
      const juros = (total + aporte) * rentabilidadeMensal;
      total += aporte + juros;
      novaTabela.push({
        mes,
        valorInicial: total - aporte - juros,
        aporte,
        juros,
        total,
      });
    }

    setDados((prev) => ({
      ...prev,
      rentabilidadeReal: parseFloat((rentabilidadeReal * 100).toFixed(5)),
      valorDesejado: parseFloat(valorDesejadoAjustado.toFixed(2)),
      aporteNecessario: parseFloat(Math.abs(aporteInicial).toFixed(2)),
    }));

    setTabela(novaTabela);
    setMostrarTabela(true); // 👈 mostrar a tabela após calcular
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDados((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  }

  return (
    <div className="investirContainer p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">
        Quanto Investir para Chegar a 1 Milhão
      </h2>
      <div>
        <label>Valor Inicial:</label>
        <input
          type="number"
          name="valorInicial"
          value={dados.valorInicial}
          onChange={handleChange}
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
          type="number"
          name="valorDesejado"
          value={dados.valorDesejado}
          onChange={handleChange}
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
      <button
        onClick={calcularAporteCrescente}
        className="calculateButton"
      >
        Calcular
      </button>

      {dados.aporteNecessario > 0 && (
        <>
          <div className="resultsContainer">
            <h3 className="font-semibold">Resultados:</h3>
            <p className="text-lg font-bold">
              Valor Desejado Ajustado: R${" "}
              {dados.valorDesejado.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-md">
              Aporte Inicial Necessário: R${" "}
              {dados.aporteNecessario.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
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
                <th className="classListTable border border-gray-300 p-2">Mês</th>
                <th className="classListTable border border-gray-300 p-2">Valor Inicial</th>
                <th className="classListTable border border-gray-300 p-2">Aporte</th>
                <th className="classListTable border border-gray-300 p-2">Juros</th>
                <th className="classListTable border border-gray-300 p-2">Total Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {tabela.map((linha) => (
                <tr key={linha.mes} className="text-center">
                  <td className="border border-gray-300 p-2">{linha.mes}</td>
                  <td className="border border-gray-300 p-2">
                    R${" "}
                    {linha.valorInicial.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 p-2">
                    R${" "}
                    {linha.aporte.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 p-2">
                    R${" "}
                    {linha.juros.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border border-gray-300 p-2">
                    R${" "}
                    {linha.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
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
