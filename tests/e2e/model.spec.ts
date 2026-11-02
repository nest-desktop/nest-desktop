// model.spec.ts

import { clickUntilURL, expect, gotoNESTHome, openSideNav, projectTitle, railTab, test } from "./fixtures";

test.describe("model", () => {
  test.beforeEach(async ({ page }) => {
    await gotoNESTHome(page);
    await clickUntilURL(page, railTab(page, "Model"), /#\/nest\/model\/\w+\/doc$/);
  });

  test("lists the models in the navigation", async ({ page }) => {
    const nav = await openSideNav(page, "Model", "Search model");

    await expect(nav.getByText(/15 model/)).toBeVisible();
    await expect(nav.getByRole("link", { name: "IAF psc alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "voltmeter recorder" })).toBeVisible();
  });

  test("filters models in the navigation", async ({ page }) => {
    const nav = await openSideNav(page, "Model", "Search model");

    await nav.getByRole("textbox", { name: "Search model" }).fill("iaf");

    await expect(nav.getByRole("link", { name: "IAF psc alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "IAF cond alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "voltmeter recorder" })).toBeHidden();
  });

  test("opens a model from the navigation", async ({ page }) => {
    const nav = await openSideNav(page, "Model", "Search model");

    await nav.getByRole("link", { name: "IAF psc alpha neuron" }).click();

    await expect(page).toHaveURL(/#\/nest\/model\/iaf_psc_alpha\//);
    await expect(projectTitle(page)).toHaveText("iaf_psc_alpha");
  });

  test("shows the model parameters", async ({ page }) => {
    const nav = await openSideNav(page, "Model", "Search model");
    await nav.getByRole("link", { name: "IAF psc alpha neuron" }).click();
    await expect(projectTitle(page)).toHaveText("iaf_psc_alpha");

    await page.getByRole("tab", { name: "params" }).click();
    await expect(page.getByText("membrane potential", { exact: false }).first()).toBeVisible();
  });
});
