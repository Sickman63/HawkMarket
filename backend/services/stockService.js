// services/stockService.js
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Function to scrape stock information from a given URL
async function asyncFindStockInfoFromURL(url) {
  try {
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

// Export the functions
module.exports = {
  asyncFindStockInfoFromSymbol
};