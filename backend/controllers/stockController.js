const stockService = require('../services/stockService');

// Route to fetch stock data
exports.getStockData = async (req, res) => {
  const { symbol, market } = req.query; // Extract query parameters for symbol and market

  if (!symbol || !market) {
    return res.status(400).json({ message: 'Please provide a valid stock symbol and market' });
  }

  try {
    // Use the new service function to either get data from the database or scrape as needed
    const stockData = await stockService.getStockDataFromDBOrScraper(symbol, market);
    res.status(200).json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};
