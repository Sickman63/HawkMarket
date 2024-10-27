const cheerio = require('cheerio');

(async () => {
    const url = 'https://www.google.com/finance/quote/F:NYSE?hl=en';
    const response = await fetch(url);

    const $ = cheerio.load(await response.text());
    const price = $('<div class="YMlKec fxKbKc">$20.0</div>').text();
    //console.log($.html());
    const index = $.html().indexOf("YMlKec fxKbKc")
    console.log($.html().slice(index, index + 100));
})();


let stockList = []
class Stock {
    constructor(symbol, market) {
        this.symbol = symbol
        this.market = market
    }
}
newStock = function(symbol, market) {
    let newStock = new Stock(symbol, market);
    stockList.push(newStock);
}
newStock('F', 'NYSE');
newStock('NVDA', 'NASDAQ');
newStock('TSLA', 'NASDAQ');
newStock('LCID', 'NASDAQ');
newStock('RIVN', 'NASDAQ');
newStock('AAPL', 'NASDAQ');
newStock('MSFT', 'NASDAQ');
newStock('AMZN', 'NASDAQ');
newStock('DIS', 'NYSE');
newStock('BA', 'NYSE');
newStock('BAC', 'NYSE');
newStock('BABA', 'NYSE');
newStock('VZ', 'NYSE');
newStock('T', 'NYSE');
newStock('CAT', 'NYSE');
newStock('GM', 'NYSE');
newStock('JNJ', 'NYSE');
newStock('INTC', 'NASDAQ');
newStock('SONY', 'NYSE');
newStock('TM', 'NYSE');
newStock('RBLX', 'NYSE');
newStock('ATVI', 'BMV');
newStock('DJT', 'NASDAQ');
newStock('PFE', 'NYSE');
newStock('UAL', 'NASDAQ');
newStock('DAL', 'NYSE');
newStock('AAL', 'NASDAQ');
newStock('GME', 'NYSE');
newStock('SBUX', 'NASDAQ');
newStock('META', 'NASDAQ');
newStock('XOM', 'NYSE');
newStock('SHEL', 'NYSE');
newStock('CVX', 'NYSE');
newStock('MA', 'NYSE');
newStock('V', 'NYSE');
newStock('WMT', 'NYSE');
newStock('TGT', 'NYSE');
newStock('KO', 'NYSE');
newStock('AMD', 'NASDAQ');
newStock('BBY', 'NYSE');
newStock('JPM', 'NYSE');

//fake stock to make sure it all works properly
newStock('LOL', 'NYSE');
//console.log(stockList);

async function asyncFindStockInfoFromURL(url) {
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    const symbol = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf(":"));
    const market = url.slice(url.lastIndexOf(":") + 1, url.lastIndexOf("?"));

    const nameIndex = $.html().lastIndexOf("zzDege");
    const nameTrim = $.html().slice(nameIndex, nameIndex + 100)
    const name = nameTrim.slice(nameTrim.indexOf(">") + 1, nameTrim.indexOf("<")).replace("&amp;", "&")
    const priceIndex = $.html().indexOf("YMlKec fxKbKc");
    const priceTrim = $.html().slice(priceIndex, priceIndex + 100);
    const price = priceTrim.slice(priceTrim.indexOf("$") + 1, priceTrim.indexOf("<"));
    if (name.length > 80) {
        return {
            price: -1,
            symbol: symbol,
            market: market,
            name: "invalid stock: " + symbol + ":" + market
        }
    }

    return {
        price: price,
        symbol: symbol,
        market: market,
        name: name
    }
}
/** 
 * 
 * @param {*} symbol 
 * @param {*} market 
 * @returns stock info
 */
async function asyncFindStockInfoFromSymbol(symbol, market) {
    url = 'https://www.google.com/finance/quote/' + symbol + ':' + market + '?hl=en';
    /*
    const response = await fetch(url);
    const $ = cheerio.load(await response.text());

    const nameIndex = $.html().lastIndexOf("zzDege");
    const nameTrim = $.html().slice(nameIndex, nameIndex + 100)
    let name = nameTrim.slice(nameTrim.indexOf(">") + 1, nameTrim.indexOf("<"))
    const priceIndex = $.html().indexOf("YMlKec fxKbKc");
    const priceTrim = $.html().slice(priceIndex, priceIndex + 100);
    let price = priceTrim.slice(priceTrim.indexOf("$") + 1, priceTrim.indexOf("<"));
    if (name.length > 80) {
        name = "error " + symbol + ":" + market
        price = -1
    }
    //console.log(symbol + ':' + market + " = $" + price);
    return info = {
        price: price,
        symbol: symbol,
        market: market,
        name: name
    }
    */
    return await asyncFindStockInfoFromURL(url);
}

// loop to test all stocks in stockList
for (let i = 0; i < stockList.length; i++) {
    (async () =>{
        info = await asyncFindStockInfoFromSymbol(stockList[i].symbol, stockList[i].market);
        //console.log(info.symbol + ':' + info.market + " = $" + info.price);
        console.log(info.name + ": $" + info.price);
    })();
}