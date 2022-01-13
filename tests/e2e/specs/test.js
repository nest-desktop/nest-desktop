// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  'test app container': browser => {
    browser
      .init()
      .waitForElementVisible('#app')
      .assert.elementPresent('.appInfo')
      .assert.containsText('h1', 'NEST Desktop')
      .assert.elementCount('div.logo', 1)
      .end();
  },

  'test app info': browser => {
    browser.openHomepage().assert.elementPresent('.appInfo').end();
  },
};
