import { expect, test } from "@playwright/test";

test("homepage loads and games hub link works", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1").first()).toContainText(/HotAPK Games/i, {
    timeout: 15_000,
  });
  await page.getByRole("link", { name: /^Games$/i }).first().click();
  await expect(page).toHaveURL(/\/games/);
});

test("game detail has download section", async ({ page }) => {
  await page.goto("/p999-game", {
    waitUntil: "domcontentloaded",
  });
  //test
  await expect(page.locator("h1").first()).toContainText(/P999/i, {
    timeout: 15_000,
  });
  await page.getByRole("button", { name: /download apk/i }).click();
  await expect(page.locator("#download")).toBeVisible();
});
