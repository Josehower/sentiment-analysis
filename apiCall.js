const fetch = require('node-fetch');

module.exports.sentiment = function getSentiment(inputText) {
  // send the raw text to the API to analyse the sentiment
  return fetch('https://apidemo.theysay.io/api/v1/sentiment', {
    method: 'POST',
    body: JSON.stringify({
      text: inputText,
      level: 'entity',
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Referer: 'https://apidemo.theysay.io',
    },
  });
};

module.exports.emotion = function getEmotion(inputText) {
  // send the raw text to the API to analyse the sentiment
  return fetch('https://apidemo.theysay.io/api/v1/emotion', {
    method: 'POST',
    body: JSON.stringify({
      text: inputText,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Referer: 'https://apidemo.theysay.io',
    },
  });
};
