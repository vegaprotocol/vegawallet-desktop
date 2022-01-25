// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const { cypressConfigResolver } = require("../config/cypress-config-resolver");
const cucumber = require("cypress-cucumber-preprocessor").default;

module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  on("file:preprocessor", cucumber());
  // Prevent test crashes
  // https://github.com/cypress-io/cypress/issues/7204#issuecomment-810774449
  // https://developers.google.com/web/tools/puppeteer/troubleshooting#tips
  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.family === "chromium") {
      launchOptions.args.push("--disable-dev-shm-usage");
    }
    return launchOptions;
  });
  return cypressConfigResolver(config);
};
