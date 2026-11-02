// nestHome.spec.ts

import { defaultProjects, expect, gotoNESTHome, test } from "./fixtures";

test.describe("NEST workspace home", () => {
  test.beforeEach(async ({ page }) => {
    await gotoNESTHome(page);
  });

  test("lists the default projects in the store list", async ({ page }) => {
    await expect(page.getByText("Store list")).toBeVisible();
    await expect(page.getByRole("link", { name: "New project" })).toHaveAttribute("href", "#/nest/project/new");

    for (const name of defaultProjects) {
      await expect(page.getByRole("link", { name: new RegExp(`^${name} 3 nodes, 2 connections$`) })).toBeVisible();
    }
  });

  test("lists the default models in the store list", async ({ page }) => {
    await page.getByRole("tab", { name: "Model", exact: true }).last().click();

    await expect(page.getByText("Existing models")).toBeVisible();
    await expect(page.getByRole("link", { name: /^IAF psc alpha neuron/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /^spike recorder/ })).toBeVisible();
  });

  test("reports the unreachable simulator backend", async ({ page }) => {
    await page.getByRole("button", { name: "View request logs" }).click();
    await expect(page.getByText(/\(nest backend\): Network Error/)).toBeVisible();
  });
});
