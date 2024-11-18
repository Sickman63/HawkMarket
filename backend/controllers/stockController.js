// controllers/stockController.js
const stockService = require('../services/stockService');

// Route to fetch stock data
exports.getStockData = async (req, res) => {
  try {
    const stockList = [
      { symbol: 'F', market: 'NYSE' },
      { symbol: 'NVDA', market: 'NASDAQ' },
      // Add more stocks as needed
    ];

    const stockData = await Promise.all(stockList.map(stock => stockService.asyncFindStockInfoFromSymbol(stock.symbol, stock.market)));
    res.status(200).json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};