require('dotenv').config();
const { CronJob } = require('cron');
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const download = require('./download/download.js');

const userName = process.env.USER_NAME;
const userPass = process.env.USER_PASS;

const job = new CronJob('* * */2 * * *', () => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();

    // Faz login no twitter
    await page.goto('https://tweetdeck.twitter.com/');

    await page.waitFor(2000);
    await page.click('a.Button');
    await page.waitFor(2000);
    await page.waitForSelector('div.css-1dbjc4n:nth-child(6) > label:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)');
    await page.type('div.css-1dbjc4n:nth-child(6) > label:nth-child(1)', userName); // Digita username

    await page.waitFor(2000);
    await page.keyboard.press('Tab');

    await page.keyboard.type(userPass); // Digita a senha
    await page.waitFor(2000);
    await page.click('div.r-vw2c0b');
    await page.waitFor(2000);

    // Entra no twitter depois de logado
    await page.goto('https://twitter.com/');
    await page.waitFor(5000);
    await page.click('a.r-urgr8i'); // Abre texto para digitar tweet
    await page.waitFor(5000);

    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(12000),
      page.waitFor(10000),
      page.click('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'), // some button that triggers file selection
    ]);

    try {
      const response = await axios.get('https://www.reddit.com/r/F1Porn/new.json?sort=new');
      const titlename = await response.data.data.children[0].data.title;
      const image = await response.data.data.children[0].data.url_overridden_by_dest;
      const permalink = await response.data.data.children[0].data.permalink;
      await fs.stat(`./images/${titlename}.png`, (err) => {
        if (err == null) {
          return browser.close();
        }
      });
      await download(image, `./images/${titlename}.png`);
      await fileChooser.accept([`./images/${titlename}.png`]);
      await page.type('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)', `Link: reddit.com${permalink}`);
      await page.waitFor(5000);
      await page.click('div.r-urgr8i:nth-child(4)'); // Envia tweet
      await browser.close();
    } catch (e) {
      return e;
    }
  })();
}, null, true, 'America/Sao_Paulo');
