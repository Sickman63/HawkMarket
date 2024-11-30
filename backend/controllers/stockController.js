const stockService = require('../services/stockService');

// Route to fetch stock data
exports.getStockData = async (req, res) => {
  const { symbol} = req.query;

  if (!symbol) {
    return res.status(400).json({ message: 'Please provide a valid stock symbol' });
  }

  try {
    // Use the new service function to either get data from the database or scrape as needed
    const stockData = await stockService.getStockDataFromDB(symbol);

    if (stockData.length === 0) {
      return res.status(404).json({ message: 'No matching stocks found in the database' });
    }
    
    res.status(200).json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Failed to fetch stock data' });
  }
};
