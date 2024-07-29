const fs = require('fs');
const util = require('util');


const readFromFile = util.promisify(fs.readFile);


const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file, onComplete, onError) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      onError(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
      onComplete();
    }
  });
};

module.exports = { readFromFile, writeToFile, readAndAppend };
