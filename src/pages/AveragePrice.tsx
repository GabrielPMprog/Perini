import React, { useState } from "react";

import "./styles/AveragePrice.css"; 

const AveragePrice = () => {
  const [compras, setCompras] = useState<{ quantidade: number; valor: number }[]>([]);
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [precoMedio, setPrecoMedio] = useState<string | null>(null);
const [erro, setErro] = useState<string | null>(null);

  const adicionarCompra = () => {
    const q = parseInt(quantidade, 10);
    const v = parseFloat(valor);

    if (!q || !v) return setErro("*Por favor, preencha ambos os campos corretamente.");

    const novaCompra = { quantidade: q, valor: v };
    const novasCompras = [...compras, novaCompra];
    setCompras(novasCompras);
    setQuantidade("");
    setValor("");

    calcularPrecoMedio(novasCompras);
  };

  const calcularPrecoMedio = (listaCompras: any[]) => {
    const totalInvestido = listaCompras.reduce(
      (soma, compra) => soma + compra.valor,
      0
    );
    const totalAcoes = listaCompras.reduce(
      (soma, compra) => soma + compra.quantidade,
      0
    );

    const media = totalInvestido / totalAcoes;
    console.log(media)
    setPrecoMedio(media.toFixed(2));
  };

  return (
    <div className="pmCalcContainer" >
      <h2>Calculadora de Preço Médio</h2>
      <div>
        <label>
          Quantidade de Ações:
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Valor Total Pago:
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="contentAvgPrice">
      <span className="errorAveragePrice">{erro}</span>
      <button onClick={adicionarCompra}>Adicionar Compra</button>
</div>
      <h3>Compras:</h3>
      <ul>
        {compras.map((c, index) => (
          <li key={index}>
            {c.quantidade} ações por R$ {c.valor.toFixed(2)}
          </li>
        ))}
      </ul>

      {precoMedio && (
        <h3>Preço Médio Total: R$ {precoMedio}</h3>
      )}
    </div>
  );
};

export default AveragePrice;