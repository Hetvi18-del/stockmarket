const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Mock stock data or you can use any public API
const stocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 170 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2800 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 300 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 750 },
];

// Endpoint to get stock list
app.get("/api/stocks", (req, res) => {
  res.json(stocks);
});

// Endpoint to get price history mock data for chart
app.get("/api/stocks/:symbol/history", (req, res) => {
  const { symbol } = req.params;

  // Mock price history (last 7 days)
  const history = [
    { date: "2025-06-15", price: Math.random() * 100 + 100 },
    { date: "2025-06-16", price: Math.random() * 100 + 100 },
    { date: "2025-06-17", price: Math.random() * 100 + 100 },
    { date: "2025-06-18", price: Math.random() * 100 + 100 },
    { date: "2025-06-19", price: Math.random() * 100 + 100 },
    { date: "2025-06-20", price: Math.random() * 100 + 100 },
    { date: "2025-06-21", price: Math.random() * 100 + 100 },
  ];

  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
