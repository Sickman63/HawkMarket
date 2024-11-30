const pool = require('../database/connection');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Function to scrape stock information from a given URL
async function asyncFindStockInfoFromURL(url) {
  try {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    const symbol = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(":"));
    const market = url.slice(url.lastIndexOf(":") + 1, url.lastIndexOf("?"));

    // Extract stock name
    const nameIndex = $.html().lastIndexOf("zzDege");
    const nameTrim = $.html().slice(nameIndex, nameIndex + 100);
    const name = nameTrim.slice(nameTrim.indexOf(">") + 1, nameTrim.indexOf("<")).replace("&amp;", "&");

    // Extract stock price
    const priceIndex = $.html().indexOf("YMlKec fxKbKc");
    const priceTrim = $.html().slice(priceIndex, priceIndex + 100);
    const price = priceTrim.slice(priceTrim.indexOf("$") + 1, priceTrim.indexOf("<"));

    // Handle invalid stock names
    if (name.length > 80) {
      return {
        price: -1,
        symbol: symbol,
        market: market,
        name: `invalid stock: ${symbol}:${market}`
      };
    }

    return {
      price: parseFloat(price.replace(',', '')), // Convert price to a float value
      symbol: symbol,
      market: market,
      name: name
    };
  } catch (error) {
    console.error('Error fetching stock information:', error);
    throw new Error('Failed to fetch stock information');
  }
}

// Function to fetch stock information using symbol and market
async function asyncFindStockInfoFromSymbol(symbol, market) {
  const url = `https://www.google.com/finance/quote/${symbol}:${market}?hl=en`;
  return await asyncFindStockInfoFromURL(url);
}

// Function to update stock prices in the database
async function updateStockPrices() {
  const stockList = [
    { symbol: 'F', market: 'NYSE' },
    { symbol: 'NVDA', market: 'NASDAQ' },
    { symbol: 'AAPL', market: 'NASDAQ' },
    { symbol: 'PFE', market: 'NYSE' },
    { symbol: 'AMZN', market: 'NASDAQ' },
    { symbol: 'MSFT', market: 'NASDAQ' },
    { symbol: 'TSLA', market: 'NASDAQ' },
    { symbol: 'GOOGL', market: 'NASDAQ' },
    { symbol: 'NFLX', market: 'NASDAQ' },
    { symbol: 'DIS', market: 'NYSE' },
    { symbol: 'JPM', market: 'NYSE' },
    { symbol: 'BAC', market: 'NYSE' },
    { symbol: 'V', market: 'NYSE' },
    { symbol: 'JNJ', market: 'NYSE' },
    { symbol: 'WMT', market: 'NYSE' },
    { symbol: 'PG', market: 'NYSE' },
    { symbol: 'KO', market: 'NYSE' },
    { symbol: 'PEP', market: 'NASDAQ' },
    { symbol: 'XOM', market: 'NYSE' },
    { symbol: 'NKE', market: 'NYSE' },
    // Add more stocks as needed
  ];

  for (let stock of stockList) {
    try {
      // Use the existing scraper to get stock data
      const stockData = await asyncFindStockInfoFromSymbol(stock.symbol, stock.market);

      // Insert or update the stock table in the database
      await pool.query(
        `INSERT INTO stock (symbol, market, name, current_price, last_updated)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (symbol)
         DO UPDATE SET 
             current_price = EXCLUDED.current_price,
             last_updated = EXCLUDED.last_updated;`,
        [stockData.symbol, stockData.market, stockData.name, stockData.price, new Date()]
      );
    } catch (error) {
      console.error(`Error updating stock ${stock.symbol}:`, error);
    }
  }
}

// Function to fetch stock information from the database, fallback to scraping if needed
async function getStockDataFromDB(symbol) {
  try {
    // Check the stock table in the database first
    const result = await pool.query(
      `SELECT symbol, market, name, current_price, last_updated 
       FROM stock 
       WHERE symbol ILIKE $1 AND market IN ('NYSE', 'NASDAQ')`,
      [`%${symbol}%`]
    );

    if (result.rows.length > 0) {
      return result.rows; // Return all matching stocks
    }

    return [];
  } catch (error) {
    console.error('Error fetching stock data from database:', error);
    throw new Error('Failed to fetch stock data');
  }
}

// Export the functions
module.exports = {
  asyncFindStockInfoFromSymbol,
  updateStockPrices,
  getStockDataFromDB
};