const axios = require('axios');

(async () => {
  try {
    const response = await axios.get('https://www.reddit.com/r/F1Porn/new.json?sort=new');
    console.log(response.data);
    console.log(response.data);
  } catch (error) {
    console.log(error.response.body);
  }
})();
