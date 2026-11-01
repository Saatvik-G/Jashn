import { test, expect } from "@playwright/test";

test.describe("EventSense Replan Flow Smoke Test", () => {
  test("loads workspace, triggers replan from 150 to 220 guests, and verifies diff", async ({
    page,
  }) => {
    // 1. Navigate to Jaipur Wedding Workspace
    await page.goto("/events/demo-wedding-jaipur");

    // 2. Verify title and initial 150 guests count
    await expect(page.locator("h1")).toContainText("Royal Rajputana Palace Wedding");
    await expect(page.getByText("150 Guests")).toBeVisible();

    // 3. Open Replan Drawer
    const replanButton = page.getByRole("button", { name: /Replan Plan/i });
    await replanButton.click();

    // 4. Verify Replan Drawer opened
    await expect(
      page.getByRole("heading", { name: /Replan Celebration & Inspect Changes/i })
    ).toBeVisible();

    // 5. Input prompt "Guests increased from 150 to 220"
    const input = page.getByPlaceholder(/My maternal family RSVP'd yes/i);
    await input.fill("Guests increased from 150 to 220");

    // 6. Click Calculate Diff
    const calculateButton = page.getByRole("button", { name: /Calculate Diff/i });
    await calculateButton.click();

    // 7. Verify Side-by-Side Diff Display
    // Before: 150, After: 220 (+70 Guests)
    await expect(page.getByText("+70 Guests")).toBeVisible();
    await expect(page.getByText(/Confirm & Apply Changes to Plan/i)).toBeVisible();
  });
});
