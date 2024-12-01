const cron = require('node-cron');
const { updateStockPrices } = require('./stockService'); // Import updateStockPrices from stockService

function startScheduler() {
  cron.schedule('*/5 * * * *', () => {
    console.log('Running stock price update...');
    updateStockPrices().then(() => {
      console.log('Stock prices updated successfully, and user account values updated accordingly.');
    }).catch((error) => {
      console.error('Error updating stock prices and user account values:', error);
    });
  });
}

module.exports = { startScheduler };
