require('dotenv').config();

const cron = require('node-cron');
const bot = require('./src/app');

cron.schedule('*/15 * * * *', () => {
  bot();
}, {
 scheduled: true,
 timezone: 'America/Sao_Paulo',
});
