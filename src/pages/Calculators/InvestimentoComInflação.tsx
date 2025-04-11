import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import './calculatorStyles/InvestimentoComInflação.css';

export default function InvestimentoInflacao() {
  const [valorInicial, setValorInicial] = useState(1000000);
  const [valorInput, setValorInput] = useState("1000000");

  const [taxaAnual, setTaxaAnual] = useState(0.5);
  const [inflacaoAnual, setInflacaoAnual] = useState(2);
  const [tempo, setTempo] = useState(30);
  const [mostrarTabela, setMostrarTabela] = useState(true);

  const handleValorInicialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    setValorInput(rawValue);
    setValorInicial(Number(rawValue));
  };

  const formatarValorInicial = () => {
    setValorInput(valorInicial.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }));
  };

  const dadosTabela = [];
  let valorAcumulado = valorInicial;
  let valorInicialAno = valorInicial;

  for (let ano = 1; ano <= tempo; ano++) {
    valorAcumulado *= 1 + taxaAnual / 100;
    const inflacaoAcumulada = Math.pow(1 + inflacaoAnual / 100, ano);
    const valorAjInflacao = valorInicial * inflacaoAcumulada;
    const valorPresente = valorAcumulado / inflacaoAcumulada;

    dadosTabela.push({
      ano: ano,
      valorInicial: valorInicialAno.toFixed(2),
      valorFinal: valorAcumulado.toFixed(2),
      valorAjInflacao: valorAjInflacao.toFixed(2),
      valorPresente: valorPresente.toFixed(2),
    });

    valorInicialAno = valorAcumulado;
  }

  return (
    <div className="investimento-container">
      <h2 className="investimento-titulo">Investimento e Inflação</h2>

      <div className="investimento-input-group">
        <label>Valor investido:</label>
        <input
          type="text"
          value={valorInput}
          onChange={handleValorInicialChange}
          onBlur={formatarValorInicial}
        />
      </div>

      <div className="investimento-input-group">
        <label>Taxa de rentabilidade (% ao <strong>ano</strong>):</label>
        <input type="number" value={taxaAnual} onChange={(e) => setTaxaAnual(Number(e.target.value))} />
      </div>

      <div className="investimento-input-group">
        <label>Inflação (% ao ano):</label>
        <input type="number" value={inflacaoAnual} onChange={(e) => setInflacaoAnual(Number(e.target.value))} />
      </div>

      <div className="investimento-input-group">
        <label>Tempo (anos):</label>
        <input type="number" value={tempo} onChange={(e) => setTempo(Number(e.target.value))} />
      </div>

      <div className="investimento-resultados">
  <p>
    <strong>Valor Final:</strong>{" "}
    R$ {Number(dadosTabela[dadosTabela.length - 1]?.valorFinal || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })}
  </p>
  <p>
    <strong>Valor Final Ajustado (Valor Presente):</strong>{" "}
    R$ {Number(dadosTabela[dadosTabela.length - 1]?.valorPresente || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })}
  </p>
</div>

      <button
        className="investimento-toggle-btn"
        onClick={() => setMostrarTabela(!mostrarTabela)}
      >
        {mostrarTabela ? "Esconder Tabela" : "Mostrar Tabela"}
      </button>

      {mostrarTabela && (
        <div className={`investimento-tabela-wrapper ${mostrarTabela ? 'show' : 'hide'}`}>
          <h3 className="investimento-subtitulo">Tabela</h3>
          <table className="investimento-table">
            <thead>
              <tr className="investimento-table-header">
                <th>Ano</th>
                <th>Valor Inicial (do ano)</th>
                <th>Valor Final (com juros)</th>
                <th>Ajustado pela Inflação</th>
                <th>Valor Presente</th>
              </tr>
            </thead>
            <tbody>
              {dadosTabela.map((linha) => (
                <tr key={linha.ano} className="investimento-table-row">
                  <td>{linha.ano}</td>
                  <td>R$ {Number(linha.valorInicial).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>R$ {Number(linha.valorFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>R$ {Number(linha.valorAjInflacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>R$ {Number(linha.valorPresente).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="investimento-subtitulo">Gráfico</h3>
      <ResponsiveContainer width="100%" height={400} className="graphic">
        <LineChart data={dadosTabela}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ano" />
          <YAxis />
          <Tooltip formatter={(value: any) => `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          <Legend />
          <Line type="monotone" dataKey="valorFinal" name="Valor Final" stroke="#82ca9d" />
          <Line type="monotone" dataKey="valorPresente" name="VF Valor Presente" stroke="#ff6f61" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
