import { useState } from "react";
import "./calculatorStyles/InCashCalc.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type InvestmentOption =
  | "nao-aplico"
  | "poupanca"
  | "tesouro-selic"
  | "cdb-grande"
  | "cdb-medio"
  | "personalizado";

const investmentRates: Record<InvestmentOption, number> = {
  "nao-aplico": 0,
  poupanca: 6,
  "tesouro-selic": 10,
  "cdb-grande": 9,
  "cdb-medio": 12,
  personalizado: 0,
};

function getIRRate(months: number) {
  if (months <= 6) return 0.225;
  if (months <= 12) return 0.2;
  if (months <= 24) return 0.175;
  return 0.15;
}

function InCashCalc() {
  const isLargeScreen = window.innerWidth >= 800;

  const [valorCheio, setValorCheio] = useState(0);
  const [valorCheioInput, setValorCheioInput] = useState("");

  const [aplicarDesconto, setAplicarDesconto] = useState(false);
  const [desconto, setDesconto] = useState(0);

  const [quantidadeParcelas, setQuantidadeParcelas] = useState(1);
  const [mostrarAvancado, setMostrarAvancado] = useState(false);
  const [entrada, setEntrada] = useState(0);
  const [entradaInput, setEntradaInput] = useState("");
  const [taxaJurosFinanciamento, setTaxaJurosFinanciamento] = useState(0);

  const [investmentOption, setInvestmentOption] =
    useState<InvestmentOption>("nao-aplico");
  const [customYield, setCustomYield] = useState(0);

  const valorVista = aplicarDesconto
    ? valorCheio * (1 - desconto / 100)
    : valorCheio;

  const principal = Math.max(0, valorCheio - entrada);
  const jurosMensalFinanciamento = taxaJurosFinanciamento / 100;
  const valorParcelaAvancado =
    quantidadeParcelas > 0 && jurosMensalFinanciamento > 0
      ? principal *
        (jurosMensalFinanciamento / 
          (1 - Math.pow(1 + jurosMensalFinanciamento, -quantidadeParcelas)))
      : quantidadeParcelas > 0
      ? principal / quantidadeParcelas
      : 0;

  const valorParcelaCalc = mostrarAvancado
    ? valorParcelaAvancado
    : valorCheio / Math.max(1, quantidadeParcelas);

  const annualYield =
    investmentOption === "personalizado"
      ? customYield
      : investmentRates[investmentOption];
  const monthlyYield =
    annualYield > 0 ? Math.pow(1 + annualYield / 100, 1 / 12) - 1 : 0;

  const calcularValorInvestido = () => {
    const valorInicialInvestido = mostrarAvancado
      ? Math.max(0, valorVista - entrada)
      : valorVista;

    let investedValue = valorInicialInvestido;
    const values = [investedValue];

    for (let i = 1; i <= quantidadeParcelas; i++) {
      investedValue *= 1 + monthlyYield;
      investedValue -= valorParcelaCalc;
      values.push(investedValue);
    }

    return values;
  };
  const calcularTotalParcelas = () => {
    const values = [mostrarAvancado ? entrada : 0];
    let total = values[0];

    for (let i = 1; i <= quantidadeParcelas; i++) {
      total += valorParcelaCalc;
      values.push(total);
    }
    return values;
  };

  const investedValues = calcularValorInvestido();
  const totalParcelas = calcularTotalParcelas();

  const chartData = Array.from({ length: quantidadeParcelas + 1 }, (_, i) => ({
    month: i,
    investido: investedValues[i],
    valorAVista: i === 0 ? valorVista : 0,
  }));

  const pvParcelas = Array.from(
    { length: quantidadeParcelas },
    (_, index) => valorParcelaCalc / Math.pow(1 + monthlyYield, index + 1)
  ).reduce((acum, parcela) => acum + parcela, mostrarAvancado ? entrada : 0);

  const melhorOpcao = valorVista < pvParcelas ? "À vista" : "A prazo";
  const descontoNecessario =
    valorCheio > 0 ? (1 - pvParcelas / valorCheio) * 100 : 0;
  const valorIdealComDesconto =
    valorCheio > 0 ? valorCheio * (1 - descontoNecessario / 100) : 0;

  const valorFinalBruto = investedValues[quantidadeParcelas];
  let valorFinalLiquido = valorFinalBruto;
  if (
    investmentOption !== "nao-aplico" &&
    investmentOption !== "tesouro-selic"
  ) {
    const irRate = getIRRate(quantidadeParcelas);
    const rendimento = valorFinalBruto - valorVista;
    valorFinalLiquido = valorFinalBruto - rendimento * irRate;
  }

  return (
    <div className="inCashContainer">
      <h2 className="inCashTitle">Simulador: À Vista ou a Prazo?</h2>

      <div className="inCashSection">
        <h3 className="inCashSectionTitle">Compra</h3>
        <label className="inCashLabel">
          Valor Cheio (R$):
          <input
            type="text"
            value={
              valorCheioInput !== ""
                ? valorCheioInput
                : valorCheio.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
            }
            onChange={(e) => setValorCheioInput(e.target.value)}
            onBlur={() => {
              const raw = valorCheioInput
                .replace(/[^\d,]/g, "")
                .replace(",", ".");
              const parsed = parseFloat(raw);
              setValorCheio(isNaN(parsed) ? 0 : parsed);
              setValorCheioInput("");
            }}
            onFocus={() => {
              setValorCheioInput(valorCheio.toString().replace(".", ","));
            }}
          />
        </label>
        <label className="inCashLabel checkboxLabel">
          <input
            type="checkbox"
            checked={aplicarDesconto}
            onChange={(e) => setAplicarDesconto(e.target.checked)}
          />
          Aplicar desconto
        </label>

        {aplicarDesconto && (
          <label className="inCashLabel">
            Desconto (%):
            <input
              type="number"
              value={desconto}
              onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
            />
          </label>
        )}
      </div>

      <div className="inCashSection">
        <h3 className="inCashSectionTitle">Pagamento a Prazo</h3>
        <label className="inCashLabel">
          Nº de Parcelas:
          <input
            type="number"
            value={quantidadeParcelas}
            onChange={(e) =>
              setQuantidadeParcelas(parseInt(e.target.value, 10) || 1)
            }
          />
        </label>

        <button
          type="button"
          className="inCashAvancadoBtn"
          onClick={() => setMostrarAvancado(!mostrarAvancado)}
        >
          Avançado
        </button>

        {mostrarAvancado && (
          <div className="inCashAvancadoContainer">
            <label className="inCashLabel">
              Entrada (R$):
              <input
                type="text"
                value={
                  entradaInput !== ""
                    ? entradaInput
                    : entrada.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                }
                onChange={(e) => setEntradaInput(e.target.value)}
                onBlur={() => {
                  const raw = entradaInput
                    .replace(/[^\d,]/g, "")
                    .replace(",", ".");
                  const parsed = parseFloat(raw);
                  setEntrada(isNaN(parsed) ? 0 : parsed);
                  setEntradaInput("");
                }}
                onFocus={() => {
                  setEntradaInput(entrada.toString().replace(".", ","));
                }}
              />
            </label>

            <label className="inCashLabel">
              Taxa de Juros (% a.m.):
              <input
                type="number"
                value={taxaJurosFinanciamento}
                onChange={(e) =>
                  setTaxaJurosFinanciamento(parseFloat(e.target.value) || 0)
                }
              />
            </label>
          </div>
        )}

        <div className="inCashSection">
          <h3 className="inCashSectionTitle">Investimento (Rendimento)</h3>
          <div className="inCashRadioGroup">
            {Object.entries(investmentRates).map(([key, rate]) => (
              <label key={key}>
                <input
                  type="radio"
                  name="investment"
                  value={key}
                  checked={investmentOption === key}
                  onChange={(e) =>
                    setInvestmentOption(e.target.value as InvestmentOption)
                  }
                />
                {key === "personalizado"
                  ? "Personalizar"
                  : `${key.replace("-", " ")} ${rate ? `(${rate}% a.a.)` : ""}`}
              </label>
            ))}
          </div>

          {investmentOption === "personalizado" && (
            <label className="inCashLabel">
              Taxa personalizada (% a.a.):
              <input
                type="number"
                value={customYield}
                onChange={(e) =>
                  setCustomYield(parseFloat(e.target.value) || 0)
                }
              />
            </label>
          )}
        </div>

        <div className="inCashResults">
          <h3 className="inCashSectionTitle">Resultados</h3>
          <p className="inCashResult">
            <strong>Valor à vista:</strong> R$ {valorVista.toFixed(2)}
          </p>
          <p className="inCashResult">
            <strong>Valor Presente das Parcelas:</strong> R${" "}
            {pvParcelas.toFixed(2)}
          </p>
          <p className="inCashResult">
            <strong>Melhor opção:</strong> {melhorOpcao}
          </p>
        </div>

        <div className="inCashSection">
          <h3 className="inCashSectionTitle">
            Evolução do Investimento vs Parcelas
          </h3>
          <div className="graph-caption">
            <p>
              Comparação entre investir o valor à vista (com rendimentos) e o
              total pago em parcelas.
            </p>
          </div>
          <div className="inCashChartContainer">
            <ResponsiveContainer
              width="100%"
              height={500}
              className={"inCashChart"}
            >
              <LineChart
                data={chartData}
                className={"inCashChart"}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  label={{ value: "Meses", position: "bottom", offset: 15 }}
                />
                <YAxis
                  label={{
                    value: "Valor (R$)",
                    angle: -90,
                    position: "left",
                    offset: 10,
                  }}
                />
                <Tooltip
                  formatter={(value) => [`R$ ${Number(value).toFixed(2)}`]}
                  labelFormatter={(label) => `Mês ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: 50 }} />
                <Line
                  type="monotone"
                  dataKey="investido"
                  stroke="#afc74e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Valor Investido"
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="valorAVista"
                  stroke="#2E2E2E"
                  strokeWidth={3}
                  dot={false}
                  name="Valor à Vista (sem rendimento)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InCashCalc;
