require('dotenv').config();

const withImages = require('next-images');

const publicRuntimeConfig = {};
const serverRuntimeConfig = {};

Object.keys(process.env).forEach(key => {
  switch (true) {
    case key.startsWith('SERVER_'):
      serverRuntimeConfig[key] = process.env[key];
      break;
    case key.startsWith('PUBLIC_'):
      publicRuntimeConfig[key] = process.env[key];
      break;
    default:
  }
});

module.exports = withImages({
  serverRuntimeConfig,
  publicRuntimeConfig,
});
