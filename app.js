import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [portfolio, setPortfolio] = useState({}); // symbol -> shares owned
  const [sharesToBuy, setSharesToBuy] = useState(0);

  useEffect(() => {
    // Fetch stocks
    axios.get("http://localhost:4000/api/stocks").then(res => {
      setStocks(res.data);
      setSelectedStock(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedStock) {
      // Fetch stock history
      axios
        .get(`http://localhost:4000/api/stocks/${selectedStock.symbol}/history`)
        .then(res => {
          setHistory(res.data);
        });
    }
  }, [selectedStock]);

  const buyShares = () => {
    if (sharesToBuy <= 0) return;
    setPortfolio(prev => {
      const currentShares = prev[selectedStock.symbol] || 0;
      return { ...prev, [selectedStock.symbol]: currentShares + Number(sharesToBuy) };
    });
    setSharesToBuy(0);
  };

  const sellShares = () => {
    if (sharesToBuy <= 0) return;
    setPortfolio(prev => {
      const currentShares = prev[selectedStock.symbol] || 0;
      const newShares = currentShares - Number(sharesToBuy);
      if (newShares < 0) return prev; // can't sell more than owned
      return { ...prev, [selectedStock.symbol]: newShares };
    });
    setSharesToBuy(0);
  };

  const chartData = {
    labels: history.map(h => h.date),
    datasets: [
      {
        label: selectedStock ? selectedStock.symbol : "",
        data: history.map(h => h.price),
        borderColor: "rgb(75, 192, 192)",
        fill: false,
      }
    ],
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Stock Market Dashboard</h1>
      <div style={{ display: "flex", gap: 30 }}>
        {/* Stock list */}
        <div style={{ flex: 1 }}>
          <h2>Stocks</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stocks.map(stock => (
              <li
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  backgroundColor: selectedStock?.symbol === stock.symbol ? "#cce5ff" : "transparent"
                }}
              >
                <b>{stock.symbol}</b> - {stock.name} - ${stock.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>

        {/* Stock detail & buy/sell */}
        <div style={{ flex: 2 }}>
          {selectedStock && (
            <>
              <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
              <p>Current Price: ${selectedStock.price.toFixed(2)}</p>

              <div style={{ marginBottom: 20 }}>
                <input
                  type="number"
                  min="0"
                  value={sharesToBuy}
                  onChange={e => setSharesToBuy(e.target.value)}
                  placeholder="Shares"
                />
                <button onClick={buyShares} style={{ marginLeft: 10 }}>
                  Buy
                </button>
                <button onClick={sellShares} style={{ marginLeft: 10 }}>
                  Sell
                </button>
              </div>

              <h3>Price History (Last 7 days)</h3>
              <Line data={chartData} />

              <h3>Portfolio</h3>
              <ul>
                {Object.entries(portfolio).map(([symbol, shares]) => (
                  <li key={symbol}>
                    {symbol}: {shares} shares
                  </li>
                ))}
                {Object.keys(portfolio).length === 0 && <p>No stocks owned</p>}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
