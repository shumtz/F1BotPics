require('dotenv').config();

const cron = require('node-cron');
const bot = require('./src/app');

cron.schedule('*/10 * * * *', () => {
  bot();
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo',
});
