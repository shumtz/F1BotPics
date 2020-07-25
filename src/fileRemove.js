const { CronJob } = require('cron');
const fsExtra = require('fs-extra');

fsExtra.emptyDirSync('./images');
