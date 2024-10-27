const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const fetch = require('node-fetch');

// Scraper logic
async function asyncFindStockInfoFromURL(url) {
  const response = await fetch(url);
  const $ = cheerio.load(await response.text());

  const symbol = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(":"));
  const market = url.slice(url.lastIndexOf(":") + 1, url.lastIndexOf("?"));

  const nameIndex = $.html().lastIndexOf("zzDege");
  const nameTrim = $.html().slice(nameIndex, nameIndex + 100);
  const name = nameTrim.slice(nameTrim.indexOf(">") + 1, nameTrim.indexOf("<")).replace("&amp;", "&");
  const priceIndex = $.html().indexOf("YMlKec fxKbKc");
  const priceTrim = $.html().slice(priceIndex, priceIndex + 100);
  const price = priceTrim.slice(priceTrim.indexOf("$") + 1, priceTrim.indexOf("<"));
  if (name.length > 80) {
    return {
      price: -1,
      symbol: symbol,
      market: market,
      name: "invalid stock: " + symbol + ":" + market
    };
  }

  return {
    price: price,
    symbol: symbol,
    market: market,
    name: name
  };
}

async function asyncFindStockInfoFromSymbol(symbol, market) {
  const url = `https://www.google.com/finance/quote/${symbol}:${market}?hl=en`;
  return await asyncFindStockInfoFromURL(url);
}

// Route to fetch stock data
router.get('/', async (req, res) => {
  const stockList = [
    { symbol: 'F', market: 'NYSE' },
    { symbol: 'NVDA', market: 'NASDAQ' },
    // Add more stocks as needed
  ];

  try {
    const stockData = await Promise.all(stockList.map(stock => asyncFindStockInfoFromSymbol(stock.symbol, stock.market)));
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ message: 'Error fetching stock data' });
  }
});

// Route to handle buy requests
router.post('/buy', async (req, res) => {
  const { symbol, market, quantity } = req.body;
  // Handle buy logic here
  res.json({ message: `Bought ${quantity} shares of ${symbol}:${market}` });
});

// Route to handle sell requests
router.post('/sell', async (req, res) => {
  const { symbol, market, quantity } = req.body;
  // Handle sell logic here
  res.json({ message: `Sold ${quantity} shares of ${symbol}:${market}` });
});

module.exports = router;