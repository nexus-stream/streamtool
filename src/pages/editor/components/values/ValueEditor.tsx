import { FC, useState } from "react";
import {
  DefaultValueVisualizer,
  ValueVisualizerProps,
} from "./DefaultValueVisualizer";
import {
  DefaultOverrideEditor,
  OverrideEditorProps,
} from "./DefaultOverrideEditor";
import { css, ToggleButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSyncableLocalState } from "./useSyncableLocalState";
import classNames from "classnames";
import { STYLES } from "../../../../style/styles";
import { size } from "../../../../style/theme";

interface Props<TValue> {
  label: string;
  value: TValue;
  override: TValue | undefined;
  setOverride: (value: TValue | undefined) => void;

  ValueVisualizer?: FC<ValueVisualizerProps<TValue>>;
  OverrideEditor?: FC<OverrideEditorProps<TValue>>;
}

// A base helper component to edit an overridable value. Because we often don't
// want an override to take effect until it's been fully edited (want to avoid
// viewers watching you type in the overridden value letter by letter), this keeps
// the override value in local state, and only passes it out of the component when
// the override is enabled.
export function ValueEditor<TValue>({
  label,
  value,
  override: backingOverride,
  setOverride: setBackingOverride,

  ValueVisualizer = DefaultValueVisualizer<TValue>,
  OverrideEditor = DefaultOverrideEditor<TValue>,
}: Props<TValue>) {
  const [override, setOverride, isOverrideSynced, setIsOverrideSynced] =
    useSyncableLocalState(backingOverride, setBackingOverride);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div css={containerStyle}>
      <div
        className={classNames({ deemphasized: isOverrideSynced })}
        css={valueContainerStyle}
      >
        <ValueVisualizer label={label} value={value} />
        <ToggleButton
          size="small"
          value="check"
          selected={isOverrideSynced || isEditOpen}
          onChange={() => setIsEditOpen((old) => isOverrideSynced || !old)}
        >
          <EditIcon />
        </ToggleButton>
      </div>
      {(isOverrideSynced || isEditOpen) && (
        <div
          className={classNames({ deemphasized: !isOverrideSynced })}
          css={overrideContainerStyle}
        >
          <OverrideEditor
            label={`${label} Override`}
            override={override}
            setOverride={setOverride}
          />
          <ToggleButton
            size="small"
            value="check"
            selected={isOverrideSynced}
            onChange={() => setIsOverrideSynced(!isOverrideSynced)}
          >
            {isOverrideSynced ? "Clear" : "Enable"}
          </ToggleButton>
        </div>
      )}
    </div>
  );
}

const containerStyle = css`
  ${STYLES.spacedFlex};
  flex-direction: column;
`;

const valueContainerStyle = css`
  ${STYLES.spacedFlex};

  &.deemphasized {
    opacity: 30%;
  }
`;

const overrideContainerStyle = css`
  ${STYLES.spacedFlex};
  padding-left: ${size(8)};

  &.deemphasized {
    opacity: 70%;
  }
`;
