const app = require('./config/express');
const mongo = require('./config/mongo');
const settings = require('./config/settings');

const debug = require('debug')('index');

mongo.connect().then((result) => {
  console.log(result);

  app.listen(settings.port);
  console.log(`Server started succesfully, running on port: ${settings.port}. \n \n`);
}).catch(error => console.log(` Something was wrong:  ${error}`));

module.exports = app;
