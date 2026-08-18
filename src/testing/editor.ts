import { screen } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";

// The editor's value controls expose their edit/save/override affordances as
// aria-labels derived from the field label, so these helpers drive them by
// accessible name the way a screen reader or a user would find them.

// Drive a StageValueEditor (e.g. "Stream Title"): click edit, type, save.
export async function editStageValue(
  user: UserEvent,
  fieldLabel: string,
  newValue: string,
) {
  await user.click(screen.getByRole("button", { name: `Edit ${fieldLabel}` }));
  const input = screen.getByLabelText(fieldLabel);
  await user.clear(input);
  await user.type(input, newValue);
  await user.click(screen.getByRole("button", { name: `Save ${fieldLabel}` }));
}

// Drive a ValueEditor override (e.g. race "Game"): click edit, type, Enable.
export async function overrideValue(
  user: UserEvent,
  fieldLabel: string,
  newValue: string,
) {
  await user.click(screen.getByRole("button", { name: `Edit ${fieldLabel}` }));
  const overrideField = await screen.findByLabelText(`${fieldLabel} Override`);
  await user.clear(overrideField);
  await user.type(overrideField, newValue);
  await user.click(
    screen.getByRole("button", { name: `Enable ${fieldLabel} Override` }),
  );
}
