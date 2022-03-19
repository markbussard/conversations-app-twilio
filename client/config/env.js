const fs = require('fs');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const dotenvFiles = [
  `${paths.dotenv}`,
  // `${paths.dotenv}.${process.env.NODE_ENV || 'local'}`
].filter(Boolean);

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    // eslint-disable-next-line global-require
    require('dotenv').config({
      path: dotenvFile
    });
  }
});

// Grab REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  // Removing 'REACT_APP_'
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce((env, key) => {
      const formattedKey = key.replace(REACT_APP, '');
      env[formattedKey] = process.env[key];
      return env;
    }, {});
  // Stringify all values so we can feed them into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
