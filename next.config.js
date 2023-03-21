const withTM = require('next-transpile-modules')(['marked']);

module.exports = withTM({
  reactStrictMode: true,
});
