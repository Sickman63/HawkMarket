const cron = require('node-cron');
const { updateStockPrices } = require('./stockService'); // Import updateStockPrices from stockService

function startScheduler() {
  cron.schedule('* * * * *', () => {
    console.log('Running stock price update...');
    updateStockPrices().then(() => {
      console.log('Stock prices updated successfully');
    }).catch((error) => {
      console.error('Error updating stock prices:', error);
    });
  });
}

module.exports = { startScheduler };
