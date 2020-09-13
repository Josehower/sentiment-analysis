const apiCall = require('./apiCall.js');
const getSentiment = apiCall.sentiment;
const getEmotion = apiCall.emotion;

const path = require('path');
const fs = require('fs');
let input;

const commandInput = process.argv[2];
const inputExtName = process.argv[2] ? path.extname(process.argv[2]) : false;
const isInputAFile = inputExtName !== ''; //boolean

if (process.argv.length > 3) {
  //check for only one argument
  console.log('for a long text make sure you use ""; e.g.("your long text")');
  return;
}

if (!process.argv[2]) {
  //check for the text argument
  console.log('sorry but, I need a text to analyse');
  return;
}

function emotionPrinter(emotionMsg) {
  // format the emotion string from the API and log the final response
  console.log(`The emotions found in the text are: \n`);
  emotionMsg.forEach((item) =>
    console.log(
      `${item.dimension.slice(0, -2)} (whit an ${Math.floor(
        item.confidence * 100,
      )}% certainty)`,
    ),
  );
}

function sentimentPrinter(sentimentMsg) {
  // reduce and format the sentiment string from the API and log the final response
  sentimentMsgReduced = sentimentMsg.reduce(
    (
      { positive = 0, negative = 0, neutral = 0, confidence = 0 },
      sentiment,
    ) => {
      positive += sentiment.positive;
      negative += sentiment.negative;
      neutral += sentiment.neutral;
      confidence += sentiment.confidence;

      return { positive, negative, neutral, confidence };
    },
    [],
  );
  sentimentMsgReduced.positive = `${Math.floor(
    (sentimentMsgReduced.positive / sentimentMsg.length) * 100,
  )}%`;
  sentimentMsgReduced.negative = `${Math.floor(
    (sentimentMsgReduced.negative / sentimentMsg.length) * 100,
  )}%`;
  sentimentMsgReduced.neutral = `${Math.floor(
    (sentimentMsgReduced.neutral / sentimentMsg.length) * 100,
  )}%`;
  sentimentMsgReduced.confidence = `${Math.floor(
    (sentimentMsgReduced.confidence / sentimentMsg.length) * 100,
  )}%`;
  console.log(
    `\nin addition the text has the following sentiment whit a ${sentimentMsgReduced.confidence} certainty: \n`,
  );
  Object.entries(sentimentMsgReduced)
    .filter((entrie) => entrie[1] !== '0%' && entrie[0] !== 'confidence')
    .map((entrie) => `${entrie[0]}: ${entrie[1]}`)
    .forEach((entrie) => console.log(entrie));
}

function runAnalyser(text) {
  //take the text as string, Wait for the API and run the printer.
  getSentiment(text)
    .then((res) => res.json()) // expecting a json response
    .then((json) => sentimentPrinter([...json].map((item) => item.sentiment)));

  getEmotion(text)
    .then((res) => res.json()) // expecting a json response
    .then((json) => {
      emotionPrinter(
        [...json.emotions].filter((emotion) => !(emotion.score <= 0)),
      );
    });
}

if (isInputAFile) {
  // input is a file
  input = new Promise((resolve, reject) => {
    fs.readFile(`./text-analisis/${commandInput}`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });

  input
    .then((res) => runAnalyser(res))
    .catch((err) => {
      if (err.errno === -2) {
        console.log(
          `file ---> ${commandInput} <--- was not found.
Your file need to be saved on the directory ./text-analisis`,
        );
      } else {
        console.log(err);
      }
    });
} else {
  // input is a string
  input = commandInput;
  runAnalyser(input);
}
