const { CronJob } = require('cron');
const fsExtra = require('fs-extra');

const job = new CronJob('* * 21 * * *', () => {
  fsExtra.emptyDirSync('./images');
});
