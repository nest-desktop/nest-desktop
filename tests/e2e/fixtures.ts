// fixtures.ts

import { type Page, expect, test as base } from "@playwright/test";

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
  await page.getByRole("link", { name: "NEST", exact: true }).click();
  await expect(page).toHaveURL(/#\/nest\/$/);
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
  await expect(async () => {
    await link.click({ timeout: 2_000 });
    await expect(page).toHaveURL(/#\/nest\/project\/[\w-]+\/edit$/, { timeout: 2_000 });
  }).toPass({ timeout: 30_000 });

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
