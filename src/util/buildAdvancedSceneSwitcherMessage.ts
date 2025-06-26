export function buildAdvancedSceneSwitcherMessage(message: string) {
  return {
    vendorName: "AdvancedSceneSwitcher",
    requestType: "AdvancedSceneSwitcherMessage",
    requestData: { message },
  } as const;
}
