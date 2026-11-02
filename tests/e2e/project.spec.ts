// project.spec.ts

import { defaultProjects, expect, openProject, projectTitle, test } from "./fixtures";

test.describe("project", () => {
  test.beforeEach(async ({ page }) => {
    await openProject(page, "spike activity");
  });

  test("shows the network graph of the project", async ({ page }) => {
    const graph = page.getByRole("main").locator("svg").filter({ hasText: "pg1" });

    for (const label of ["pg1", "n1", "sr1"]) {
      await expect(graph.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("lists all projects in the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await expect(nav.getByText(`${defaultProjects.length} project`)).toBeVisible();
    for (const name of defaultProjects) {
      await expect(nav.getByRole("link", { name: new RegExp(`^${name} `) })).toBeVisible();
    }
  });

  test("filters projects in the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await nav.getByRole("textbox", { name: "Search project" }).fill("spatial");

    await expect(nav.getByText("2 project")).toBeVisible();
    await expect(nav.getByRole("link", { name: /^spatial spike activity / })).toBeVisible();
    await expect(nav.getByRole("link", { name: /^spatial neurons / })).toBeVisible();
    await expect(nav.getByRole("link", { name: /^spike response / })).toBeHidden();
  });

  test("switches to another project from the navigation", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();

    await nav.getByRole("link", { name: /^spike response / }).click();

    await expect(projectTitle(page)).toHaveText("spike response");
    await expect(page.getByRole("main").locator("svg").getByText("vm1", { exact: true })).toBeVisible();
  });

  test("generates the NEST script in the code controller", async ({ page }) => {
    await page.getByRole("tab", { name: "code" }).click();

    const code = page.locator(".cm-content").first();
    await expect(code).toContainText("import nest");
    await expect(code).toContainText('pg1 = nest.Create("poisson_generator"');
    await expect(code).toContainText('n1 = nest.Create("iaf_psc_alpha", 100)');
    await expect(code).toContainText("nest.Connect(n1, sr1)");
    await expect(code).toContainText("nest.Simulate(1000)");
  });

  test("updates the NEST script when the simulation time changes", async ({ page }) => {
    await page.getByRole("tab", { name: "kernel" }).click();

    const time = page.getByRole("spinbutton", { name: "time" });
    await expect(time).toHaveValue("1000");
    await time.fill("500");
    await time.press("Enter");

    await page.getByRole("tab", { name: "code" }).click();
    await expect(page.locator(".cm-content").first()).toContainText("nest.Simulate(500)");
  });

  test("shows the simulation kernel settings", async ({ page }) => {
    await page.getByRole("tab", { name: "kernel" }).click();

    await expect(page.getByText("Simulation kernel editor")).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "rng_seed" })).toHaveValue("1");
    await expect(page.getByRole("checkbox", { name: "randomize seed" })).not.toBeChecked();
  });

  test("switches between editor, explorer and lab book", async ({ page }) => {
    await page.getByRole("tab", { name: "Explorer" }).click();
    await expect(page).toHaveURL(/\/explore$/);

    await page.getByRole("tab", { name: "Lab book" }).click();
    await expect(page).toHaveURL(/\/lab$/);

    await page.getByRole("tab", { name: "Editor" }).click();
    await expect(page).toHaveURL(/\/edit$/);
  });

  test("fails to simulate without a running backend", async ({ page }) => {
    await page.getByRole("button", { name: "Simulate" }).click();

    await expect(
      page.getByText("Failed to perform simulation (Simulator backend is not running).").first(),
    ).toBeVisible();
  });

  test("creates a new project", async ({ page }) => {
    const nav = page.getByRole("main").getByRole("navigation").first();
    const projectURL = page.url();

    await page.getByTitle("Create a new project").click();

    await expect(page).not.toHaveURL(projectURL);
    await expect(page).toHaveURL(/#\/nest\/project\/[\w-]+\/edit$/);
    await expect(nav.getByText(`${defaultProjects.length + 1} project`)).toBeVisible();
  });
});
