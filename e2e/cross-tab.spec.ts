import { expect, test, type Page } from "@playwright/test";

// Real cross-tab journey: the host switches the current stage in the dock, and an
// OBS browser source (a frame) open in another tab follows. All three pages live in
// one browser context, so they share localStorage and BroadcastChannel, and
// redux-state-sync does its real job across tabs - no mocks, no store poking.
test("switching the current stage in the dock updates a frame in another tab", async ({
  browser,
}) => {
  const context = await browser.newContext();
  const editor = await context.newPage();
  const dock = await context.newPage();
  const frame = await context.newPage();

  await editor.goto("/edit");
  await dock.goto("/");
  await frame.goto("/frame/tagText?tagName=message");

  // Prepare two tag-only stages (network-free) and give each a tag the frame
  // renders, mirroring what a host does to set up a stream.
  await createStage(editor, "Alpha");
  await createStage(editor, "Beta");
  await setStageTag(editor, "Alpha", "message", "Hello from Alpha");
  await setStageTag(editor, "Beta", "message", "Hello from Beta");

  // Selecting a stage in the dock must propagate to the frame tab.
  await selectCurrentStage(dock, "Alpha");
  await expect(frame.getByText("Hello from Alpha")).toBeVisible();

  await selectCurrentStage(dock, "Beta");
  await expect(frame.getByText("Hello from Beta")).toBeVisible();
});

async function createStage(page: Page, name: string) {
  await page.getByText("Create", { exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill(name);
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
}

async function setStageTag(
  page: Page,
  stageName: string,
  tagName: string,
  tagValue: string,
) {
  await page.getByText(stageName, { exact: true }).click();
  // Synchronize on the editor switching to this stage before touching its tags.
  await expect(
    page.getByLabel("Internal Name", { exact: true }),
  ).toHaveValue(stageName);

  await page.getByRole("button", { name: "Add", exact: true }).click();
  const nameInput = page.getByRole("combobox", { name: "Name", exact: true });
  await nameInput.fill(tagName);
  await nameInput.press("Enter");
  await page.getByLabel("Value", { exact: true }).fill(tagValue);
}

async function selectCurrentStage(page: Page, name: string) {
  await page.getByLabel("Current Stage", { exact: true }).click();
  await page.getByRole("option", { name }).click();
}
