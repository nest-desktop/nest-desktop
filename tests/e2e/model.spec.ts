// model.spec.ts

import { expect, gotoNESTHome, projectTitle, test } from "./fixtures";

test.describe("model", () => {
  test.beforeEach(async ({ page }) => {
    await gotoNESTHome(page);
    await page.getByRole("navigation").getByRole("tab", { name: "Model" }).click();
    await expect(page).toHaveURL(/#\/nest\/model\/\w+\/doc$/);
  });

  test("lists the models in the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await expect(nav.getByText(/15 model/)).toBeVisible();
    await expect(nav.getByRole("link", { name: "IAF psc alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "voltmeter recorder" })).toBeVisible();
  });

  test("filters models in the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await nav.getByRole("textbox", { name: "Search model" }).fill("iaf");

    await expect(nav.getByRole("link", { name: "IAF psc alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "IAF cond alpha neuron" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "voltmeter recorder" })).toBeHidden();
  });

  test("opens a model from the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await nav.getByRole("link", { name: "IAF psc alpha neuron" }).click();

    await expect(page).toHaveURL(/#\/nest\/model\/iaf_psc_alpha\//);
    await expect(projectTitle(page)).toHaveText("iaf_psc_alpha");
  });

  test("shows the model parameters", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();
    await nav.getByRole("link", { name: "IAF psc alpha neuron" }).click();
    await expect(projectTitle(page)).toHaveText("iaf_psc_alpha");

    await page.getByRole("tab", { name: "params" }).click();
    await expect(page.getByText("membrane potential", { exact: false }).first()).toBeVisible();
  });
});
