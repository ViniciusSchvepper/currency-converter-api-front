import { useEffect, useState } from "react";
import axios from "axios";
import { currencies } from "./constants";
import ExchangeChart from "./exchangeChart";
import { saveToHistory, getHistory } from "./utils/cacheHistory";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [from, setFrom] = useState("USD");
  const [amount, setAmount] = useState("");
  const [toList, setToList] = useState(["BRL"]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // setHistory(getHistory());
  }, []);

  const handleAddCurrency = () => {
    if (toList.length < 5) {
      setToList([...toList, "USD"]);
    } else {
      alert("Você só pode adicionar até 5 moedas de destino.");
    }
  };

  const handleChangeTo = (index, value) => {
    const updated = [...toList];
    updated[index] = value;
    setToList(updated);
  };

  const handleConvert = async () => {
    setError(null);
    setResult(null);

    try {
      const requests = toList.map((currency) =>
        axios.get(
          `${import.meta.env.VITE_API_URL}/currency-converter/convert`,
          {
            params: { from, to: currency, amount },
            headers: {
              Authorization: import.meta.env.VITE_API_KEY,
            },
          }
        )
      );

      const responses = await Promise.all(requests);

      const results = responses.map((res, i) => ({
        to: toList[i],
        result: res.data.result,
        rate: res.data.rate,
        from,
        amount,
        date: new Date().toISOString(),
      }));

      setResult(results);
      saveToHistory(results);
      setHistory(getHistory());
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Erro inesperado";
      setError(msg);
    }
  };

  return (
    <>
      <div className="container">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle-floating"
          aria-label="Alternar tema"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <h1>Conversor de Moedas</h1>

        <label>Valor:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label>Moeda de origem:</label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {currencies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {toList.map((to, index) => (
          <div key={index}>
            <label>Para:</label>
            <select
              value={to}
              onChange={(e) => handleChangeTo(index, e.target.value)}
            >
              {currencies.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={handleConvert}>Converter</button>

        <div className="currency-actions">
          {toList.length < 5 && (
            <button className="half" onClick={handleAddCurrency}>
              + Adicionar moeda
            </button>
          )}

          {toList.length > 1 && (
            <button
              className={toList.length === 5 ? "full" : "half"}
              onClick={() => setToList(toList.slice(0, -1))}
            >
              Remover última
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="history">
            <h2>Histórico de Conversões</h2>
            <ul>
              {history.map((entry, i) =>
                entry.map((h, idx) => (
                  <li key={`${i}-${idx}`}>
                    {h.amount} {h.from} → {h.to} = {Number(h.result).toFixed(2)}{" "}
                    (Taxa: {h.rate.toFixed(4)})
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {result && (
          <>
            <div className="result">
              {result.map((r) => (
                <p key={r.to}>
                  {amount} {from} ={" "}
                  {Number(r.result).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{" "}
                  {r.to} — Taxa:{" "}
                  {Number(r.rate).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}
                </p>
              ))}
            </div>

            {history.length > 0 && (
              <div className="history">
                <h2>Histórico de Conversões</h2>
                <ul>
                  {history.map((entry, i) =>
                    entry.map((h, idx) => (
                      <li key={`${i}-${idx}`}>
                        {h.amount} {h.from} → {h.to} ={" "}
                        {Number(h.result).toFixed(2)} (Taxa: {h.rate.toFixed(4)}
                        )
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            <ExchangeChart from={from} toList={result.map((r) => r.to)} />
          </>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}

export default App;
