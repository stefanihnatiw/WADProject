const axios = require("axios");
require('dotenv').config();

module.exports = async function() {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes/zyTCAlFPjgYC?key=' + process.env.API_KEY);
    return response.data;

  } catch (error) {
    console.error(error);
  }

};
