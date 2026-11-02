// app.spec.ts

import { expect, gotoNESTHome, railTab, test } from "./fixtures";

test.describe("app home", () => {
  test("shows the title and the workspace selection", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/NEST Desktop/);
    await expect(page.locator(".text-title")).toHaveText("NEST Desktop");
    await expect(page.getByText("Select a workspace")).toBeVisible();
    await expect(page.getByRole("link", { name: "NEST", exact: true })).toHaveAttribute("href", "#/nest/");
  });

  test("navigates to the NEST workspace", async ({ page }) => {
    await gotoNESTHome(page);

    await expect(page.getByText("Simulator for spiking neural network models").first()).toBeVisible();
    await expect(railTab(page, "Sandbox")).toBeVisible();
    await expect(railTab(page, "Model")).toBeVisible();
  });

  test("cycles the theme with the theme toggle", async ({ page }) => {
    await page.goto("/");

    const app = page.locator(".v-application");
    const toggle = page.getByRole("button", { name: "Toggle theme" });

    // Theme order: auto -> light -> dark -> auto
    await toggle.click();
    await expect(app).toHaveClass(/v-theme--light/);
    await toggle.click();
    await expect(app).toHaveClass(/v-theme--dark/);
  });

  test("persists the theme across reloads", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Toggle theme" });
    await toggle.click();
    await toggle.click();
    await expect(page.locator(".v-application")).toHaveClass(/v-theme--dark/);

    await page.reload();
    await expect(page.locator(".v-application")).toHaveClass(/v-theme--dark/);
  });
});
