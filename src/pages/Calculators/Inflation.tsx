import { useState } from "react";
import './calculatorStyles/Milion.css';

type SimuladorProps = {
  valorInicial: number;
  aporteMensal: number;
  taxaAnual: number;
  inflacaoAnual: number;
  tempoMeses: number;
};

export default function SimuladorInflacao() {
  const [dados, setDados] = useState<SimuladorProps>({
    valorInicial: 1000,
    aporteMensal: 1000,
    taxaAnual: 11.65,
    inflacaoAnual: 3.5,
    tempoMeses: 360,
  });
  const [resultado, setResultado] = useState<{ montanteFinal: number; poderCompra: number } | null>(null);

  function calcularJuros() {
    const taxaMensal = Math.pow(1 + dados.taxaAnual / 100, 1 / 12) - 1;
    const inflacaoMensal = Math.pow(1 + dados.inflacaoAnual / 100, 1 / 12) - 1;
    const { valorInicial, aporteMensal, tempoMeses } = dados;
    
    const montanteInicial = valorInicial * Math.pow(1 + taxaMensal, tempoMeses);
    const montanteAportes = aporteMensal * ((Math.pow(1 + taxaMensal, tempoMeses) - 1) / taxaMensal) * (1 + taxaMensal);
    const montanteFinal = montanteInicial + montanteAportes;
    
    const poderCompra = montanteFinal / Math.pow(1 + inflacaoMensal, tempoMeses);
    
    setResultado({ montanteFinal: parseFloat(montanteFinal.toFixed(2)), poderCompra: parseFloat(poderCompra.toFixed(2)) });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDados(prevDados => ({ ...prevDados, [name]: Number(value) || 0 }));
  }


  return (
    <div className="simulador-container p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Simulador de Juros Compostos com Inflação</h2>
      <div className="inputContainerInflation">
        <label className="simulador-label">Valor Inicial:</label>
        <input type="number" name="valorInicial" value={dados.valorInicial} onChange={handleChange} className="simulador-input p-2 w-full" />
      </div>
      <div className="inputContainerInflation">
        <label className="simulador-label">Aporte Mensal:</label>
        <input type="number" name="aporteMensal" value={dados.aporteMensal} onChange={handleChange} className="simulador-input p-2 w-full" />
      </div>
      <div className="inputContainerInflation">
        <label className="simulador-label">Taxa Anual (%):</label>
        <input type="number" name="taxaAnual" value={dados.taxaAnual} onChange={handleChange} className="simulador-input p-2 w-full" />
      </div>
      <div className="inputContainerInflation">
        <label className="simulador-label">Inflação Anual (%):</label>
        <input type="number" name="inflacaoAnual" value={dados.inflacaoAnual} onChange={handleChange} className="simulador-input p-2 w-full" />
      </div>
      <div className="inputContainerInflation">
        <label className="simulador-label">Tempo (meses):</label>
        <input type="number" name="tempoMeses" value={dados.tempoMeses} onChange={handleChange} className="simulador-input p-2 w-full" />
      </div>
      <button onClick={calcularJuros} className="simulador-botao bg-blue-500 text-white px-4 py-2 rounded">Calcular</button>
      {resultado !== null && (
        <div className="resultsContainer">
          <h3 className="font-semibold">Resultados:</h3>
          <p className="text-lg font-bold">Patrimônio Acumulado: R$ {resultado.montanteFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-md">Poder de Compra Atual: R$ {resultado.poderCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}
