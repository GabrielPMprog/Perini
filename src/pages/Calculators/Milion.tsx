import { useState } from "react";
import './calculatorStyles/Milion.css';

type SimuladorProps = {
  valorInicial: number;
  aporteMensal: number;
  taxaAnual: number;
  tempoMeses: number;
};

export default function Milion() {
  const [dados, setDados] = useState<SimuladorProps>({
    valorInicial: 1000,
    aporteMensal: 1000,
    taxaAnual: 11.65,
    tempoMeses: 360,
  });
  const [resultado, setResultado] = useState<number | null>(null);

  function calcularJuros() {
    const taxaMensal = Math.pow(1 + dados.taxaAnual / 100, 1 / 12) - 1;
    const { valorInicial, aporteMensal, tempoMeses } = dados;
    
    const montanteInicial = valorInicial * Math.pow(1 + taxaMensal, tempoMeses);
    const montanteAportes = aporteMensal * ((Math.pow(1 + taxaMensal, tempoMeses) - 1) / taxaMensal) * (1 + taxaMensal);
    const montanteFinal = montanteInicial + montanteAportes;
    
    setResultado(parseFloat(montanteFinal.toFixed(2)));
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setDados(prevDados => ({ ...prevDados, [name]: Number(value) || 0 }));
  }

  return (
    <div className="simulador-container">
      <h2 className="titulo">Rentabilidade de investimentos</h2>
      <table className="simulador-tabela">
        <tbody>
          <tr>
            <td className="simulador-label">Valor Inicial:</td>
            <td><input type="number" name="valorInicial" value={dados.valorInicial} onChange={handleChange} className="simulador-input" /></td>
          </tr>
          <tr>
            <td className="simulador-label">Aporte Mensal:</td>
            <td><input type="number" name="aporteMensal" value={dados.aporteMensal} onChange={handleChange} className="simulador-input" /></td>
          </tr>
          <tr>
            <td className="simulador-label">Taxa Anual (%):</td>
            <td><input type="number" name="taxaAnual" value={dados.taxaAnual} onChange={handleChange} className="simulador-input" /></td>
          </tr>
          <tr>
            <td className="simulador-label">Tempo (meses):</td>
            <td><input type="number" name="tempoMeses" value={dados.tempoMeses} onChange={handleChange} className="simulador-input" /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={calcularJuros} className="simulador-botao">Calcular</button>
      {resultado !== null && (
        <div className="simulador-resultado">
          <h3>Patrimônio Acumulado:</h3>
          <p>R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      )}
    </div>
  );
}
