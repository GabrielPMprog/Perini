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

  const [editandoValorInicial, setEditandoValorInicial] = useState(false);
  const [editandoAporteMensal, setEditandoAporteMensal] = useState(false);
  const [resultado, setResultado] = useState<number | null>(null);

  function calcularJuros() {
    const taxaMensal = Math.pow(1 + dados.taxaAnual / 100, 1 / 12) - 1;
    const { valorInicial, aporteMensal, tempoMeses } = dados;

    const montanteInicial = valorInicial * Math.pow(1 + taxaMensal, tempoMeses);
    const montanteAportes = aporteMensal * ((Math.pow(1 + taxaMensal, tempoMeses) - 1) / taxaMensal) * (1 + taxaMensal);
    const montanteFinal = montanteInicial + montanteAportes;

    setResultado(parseFloat(montanteFinal.toFixed(2)));
  }

  function formatarParaReal(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function desformatarReal(valor: string): number {
    return Number(
      valor
        .replace(/\s/g, "")
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
    ) || 0;
  }

  return (
    <div className="simulador-container">
      <h2 className="titulo">Rentabilidade de investimentos</h2>

      <div className="simulador-campo">
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
            setDados(prev => ({
              ...prev,
              valorInicial: desformatarReal(e.target.value),
            }))
          }
          className="simulador-input"
        />
      </div>

      <div className="simulador-campo">
        <label>Aporte Mensal:</label>
        <input
          type="text"
          name="aporteMensal"
          value={
            editandoAporteMensal
              ? dados.aporteMensal
              : formatarParaReal(dados.aporteMensal)
          }
          onFocus={() => setEditandoAporteMensal(true)}
          onBlur={() => setEditandoAporteMensal(false)}
          onChange={(e) =>
            setDados(prev => ({
              ...prev,
              aporteMensal: desformatarReal(e.target.value),
            }))
          }
          className="simulador-input"
        />
      </div>

      <div className="simulador-campo">
        <label>Taxa Anual (%):</label>
        <input
          type="number"
          name="taxaAnual"
          value={dados.taxaAnual}
          onChange={(e) =>
            setDados(prev => ({ ...prev, taxaAnual: Number(e.target.value) }))
          }
          className="simulador-input"
        />
      </div>

      <div className="simulador-campo">
        <label>Tempo (meses):</label>
        <input
          type="number"
          name="tempoMeses"
          value={dados.tempoMeses}
          onChange={(e) =>
            setDados(prev => ({ ...prev, tempoMeses: Number(e.target.value) }))
          }
          className="simulador-input"
        />
      </div>

      <button onClick={calcularJuros} className="simulador-botao">
        Calcular
      </button>

      {resultado !== null && (
        <div className="simulador-resultado">
          <h3>Patrimônio Acumulado:</h3>
          <p className="investCalcResult">
            R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      )}
    </div>
  );
}
