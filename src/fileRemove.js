const fs = require('fs');

fs.unlink('./images/*.png', (err) => {
  if (err) {
    throw err;
  }

  console.log('File Deleted');
});
