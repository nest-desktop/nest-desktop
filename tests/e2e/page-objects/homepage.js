/**
 * A Nightwatch page object. The page object name is the filename.
 *
 * Example usage:
 *   browser.page.homepage.navigate()
 *
 * For more information on working with page objects see:
 *   https://nightwatchjs.org/guide/working-with-page-objects/
 *
 */

module.exports = {
  url: '/',
  commands: [],

  // A page object can have elements
  elements: {
    appContainer: '#app',
  },

  // Or a page objects can also have sections
  sections: {
    app: {
      selector: '#app',

      sections: {
        navigation: {
          selector: 'div.navigation',
        },

        appInfo: {
          selector: 'div.appInfo',

          elements: {
            logo: 'div.logo',
          },

          sections: {
            headline: {
              selector: 'h1',
            },
          },
        },
      },
    },
  },
};
