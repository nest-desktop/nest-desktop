// fixtures.ts

import { type Locator, type Page, expect, test as base } from "@playwright/test";

/**
 * Test fixture which keeps the tests hermetic by blocking requests to external hosts
 * (e.g. Google fonts, NEST docs), so that the tests only exercise the local frontend.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (route) => route.abort());
    await use(page);
  },
});

export { expect };

/**
 * Open the NEST workspace via the app home page.
 * @param page Page
 */
export const gotoNESTHome = async (page: Page): Promise<void> => {
  await page.goto("/");

  // The workspace link is rendered before the router is ready, thus retry until the click navigates.
  await clickUntilURL(page, page.getByRole("link", { name: "NEST", exact: true }), /#\/nest\/$/);
};

/**
 * Click a locator until the page has the expected URL.
 * @param page Page
 * @param locator element to click
 * @param url expected URL
 */
export const clickUntilURL = async (page: Page, locator: Locator, url: RegExp): Promise<void> => {
  await expect(async () => {
    // Do not click again if a previous click already navigated (e.g. with a slow redirect).
    if (!url.test(page.url())) await locator.click({ timeout: 2_000 });
    await expect(page).toHaveURL(url, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });
};

/**
 * Open the side navigation of the current view (e.g. project or model list) and return it.
 * @param page Page
 * @param tab name of the tab in the navigation rail
 * @param search placeholder of the search field
 */
export const openSideNav = async (page: Page, tab: "Sandbox" | "Model", search: string): Promise<Locator> => {
  const nav = page
    .getByRole("main")
    .getByRole("navigation")
    .filter({ has: page.getByRole("textbox", { name: search }) });
  const searchField = nav.getByRole("textbox", { name: search });

  // Off-screen elements count as visible, thus check whether the drawer is slid into the viewport.
  if (!(await searchField.evaluate((el) => el.getBoundingClientRect().left >= 0))) {
    await railTab(page, tab).click();
  }
  await expect(searchField).toBeInViewport({ ratio: 1 });

  return nav;
};

/**
 * Open a project from the store list of the NEST home page.
 * @param page Page
 * @param name project name
 */
export const openProject = async (page: Page, name: string): Promise<void> => {
  await gotoNESTHome(page);

  // The project link is rendered before the project database is initialized,
  // thus retry until the click leads to the project editor.
  const link = page.getByRole("link", { name: new RegExp(`^${name} \\d+ nodes`) });
  await clickUntilURL(page, link, /#\/nest\/project\/[\w-]+\/edit$/);

  await expect(projectTitle(page)).toHaveText(name);
};

/**
 * Get the title of the current project or model in the app bar.
 * @param page Page
 */
export const projectTitle = (page: Page) => page.locator(".v-app-bar-title");

export const defaultProjects = [
  "spike activity",
  "spatial spike activity",
  "spatial neurons",
  "spike response",
  "step current response",
];

/**
 * Get a tab of the navigation rail on the left side.
 * @param page Page
 * @param name tab name
 */
export const railTab = (page: Page, name: "Sandbox" | "Model") =>
  page.locator(".v-navigation-drawer--rail").getByRole("tab", { name, exact: true });
