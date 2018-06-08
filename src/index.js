const app = require('./config/express');
const mongo = require('./config/mongo');
const settings = require('./config/settings');

if(settings.env !== 'test') {

  mongo.connect().then((result) => {
    
    console.log(result);
  
    app.listen(settings.port, () => {
      console.info(`server started on port ${settings.port} (${settings.env})`); // eslint-disable-line no-console
    });

  }).catch(error => console.log(` Something was wrong:  ${error}`));
}

module.exports = app;
