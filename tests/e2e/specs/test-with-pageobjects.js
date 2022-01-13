////////////////////////////////////////////////////////////////
// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
//
// For more information on working with page objects see:
//   https://nightwatchjs.org/guide/working-with-page-objects/
////////////////////////////////////////////////////////////////

module.exports = {
  beforeEach: browser => browser.init(),

  'test app container': browser => {
    const homepage = browser.page.homepage();
    homepage.waitForElementVisible('@appContainer');

    const app = homepage.section.app;
    app.expect.section('@appInfo').to.be.visible;
    app.expect.section('@navigation').to.be.visible;

    browser.end();
  },

  'test app info': browser => {
    const homepage = browser.page.homepage();
    const appInfoSection = homepage.section.app.section.appInfo;

    appInfoSection.assert.elementCount('@logo', 1);
    appInfoSection.expect.section('@headline').text.to.match(/^NEST Desktop$/);
  },
};
