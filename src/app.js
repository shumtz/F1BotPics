const process = require('process');
const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');
const download = require('./download/download.js');

const userName = process.env.USER_NAME;
const userPass = process.env.USER_PASS;
const phone = process.env.PHONE;

const bot = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  // Entry in twitter.com
  await page.goto('https://twitter.com/login');

  // Type credencias login
  await page.waitFor(4000);
  await page.waitForSelector('div.css-1dbjc4n:nth-child(6) > label:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > input:nth-child(1)');
  await page.type('div.css-1dbjc4n:nth-child(6) > label:nth-child(1)', userName); // Digita username

  await page.waitFor(2000);
  await page.keyboard.press('Tab');

  // Type Password
  await page.keyboard.type(userPass);
  await page.waitFor(2000);
  await page.click('div.r-vw2c0b');
  await page.waitFor(2000);

  // Validation for acess another local (phone)

  //  await page.type('#challenge_response', phone);
  //  await page.click('#email_challenge_submit');

  // Entra no twitter depois de logado
  await page.goto('https://twitter.com/');
  await page.waitFor(5000);
  await page.click('a.r-urgr8i');


  // Select file
  const [fileChooser] = await Promise.all([
    page.waitForFileChooser(),
    page.click('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)'), // some button that triggers file selection
  ]);

  try {
    const response = await axios.get('https://www.reddit.com/r/F1Porn/new.json?sort=new');

    titlename = titlename.replace(/\s+/g, '');

    await fs.stat(__dirname + `/images/${titlename}.jpg`, (err) => {
      if (err == null) {
        return browser.close();
      }
    });
    await download(image, __dirname + `/images/${titlename}.jpg`);
    await fileChooser.accept([__dirname + `/images/${titlename}.jpg`]);
    await page.type('.r-1dqxon3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)', `#formula1 #f1 (Reddit)`);
    await page.waitFor(5000);
    await page.click('div.r-urgr8i:nth-child(4) > div:nth-child(1) > span:nth-child(1) > span:nth-child(1)'); // Envia tweet
    console.log('POSTADO')
    await page.waitFor(10000);
    await browser.close();
  } catch (e) {
    process.exit(1);
  }
};

module.exports = bot();
