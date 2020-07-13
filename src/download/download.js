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

// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// const downloadImage = async (url, path) => {
//   try {
//     const response = await axios({
//       method: 'GET',
//       url,
//       responseType: 'stream',
//     });

//     await response.data.pipe(fs.createWriteStream(path));
//     console.log('Successfully downloaded!');
//   } catch (err) {
//     throw new Error(err);
//   }
// };
