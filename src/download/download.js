const request = require('request');
const fs = require('fs');

async function download(uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', resolve);
    });
  });
}

module.exports = download;
