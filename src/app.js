const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const download = require('./download/download.js');

const userName = process.env.USER_NAME;
const userPass = process.env.USER_PASS;

const telefone = '11944757572';

const bot = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // defaultViewport: null,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  // Faz login no twitter
  await page.goto('https://twitter.com/login');

  await page.waitFor(4000);
  await page.waitForSelector('div.css-1dbjc4n:nth-child(6) > label:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)');
  await page.type('div.css-1dbjc4n:nth-child(6) > label:nth-child(1)', userName); // Digita username

  await page.waitFor(2000);
  await page.keyboard.press('Tab');

  await page.keyboard.type(userPass); // Digita a senha
  await page.waitFor(2000);
  await page.click('div.r-vw2c0b');
  await page.waitFor(2000);

  await page.type('#challenge_response', telefone);
  await page.click('#email_challenge_submit');

  // Entra no twitter depois de logado
  await page.goto('https://twitter.com/');
  await page.waitFor(5000);
  await page.click('a.r-urgr8i');
  await page.waitFor(5000);

  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'), // some button that triggers file selection
  ]);

  try {
    const response = await axios.get('https://www.reddit.com/r/F1Porn/new.json?sort=new');
    const titlename = response.data.data.children[0].data.title;
    const image = response.data.data.children[0].data.url_overridden_by_dest;
    const { permalink } = response.data.data.children[0].data;
    await fs.stat(`./src/images/${titlename}.png`, (err) => {
      if (err == null) {
        return browser.close();
      }
    });
    await download(image, `./src/images/${titlename}.png`);
    await fileChooser.accept([`./src/images/${titlename}.png`]);
    await page.type('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)', `#formula1 #f1 
Link: reddit.com${permalink}`);
    await page.waitFor(5000);
    await page.click('div.r-urgr8i:nth-child(4)'); // Envia tweet
    await browser.close();
  } catch (e) {
    return e;
  }
};

module.exports = bot;
