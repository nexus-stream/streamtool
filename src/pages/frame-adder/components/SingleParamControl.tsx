import { z } from "zod/v4";
import { NumberParamControl } from "./NumberParamControl";
import { StringParamControl } from "./StringParamControl";
import { EnumParamControl } from "./EnumParamControl";
import { FrameParamControls } from "./FrameParamControls";
import { css } from "@mui/material";
import { COLORS, size } from "../../../style/theme";
import { STYLES } from "../../../style/styles";

interface Props {
  name: string;
  schemaValue: unknown;
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
}

// Given a single param, instance one of our typed form controls to select a value for that type.
export function SingleParamControl({
  name,
  schemaValue,
  params,
  setParams,
}: Props) {
  let baseType = schemaValue;
  if (schemaValue instanceof z.ZodDefault) {
    baseType = schemaValue.def.innerType;
  }

  if (baseType instanceof z.ZodString) {
    return (
      <StringParamControl name={name} params={params} setParams={setParams} />
    );
  }

  if (baseType instanceof z.ZodNumber) {
    return (
      <NumberParamControl name={name} params={params} setParams={setParams} />
    );
  }

  if (baseType instanceof z.ZodEnum) {
    const options = baseType.options.map((option) => option.toString());
    return (
      <EnumParamControl
        name={name}
        options={options}
        params={params}
        setParams={setParams}
      />
    );
  }

  if (baseType instanceof z.ZodObject) {
    return (
      <div css={nestedControlContainerStyle}>
        <FrameParamControls
          schema={baseType}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params={(params as any)[name]}
          setParams={(newValueOrMutator) => {
            if (typeof newValueOrMutator !== "function") {
              setParams((old) => ({
                ...old,
                [name]: newValueOrMutator,
              }));
            } else {
              setParams((old) => ({
                ...old,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                [name]: newValueOrMutator((old as any)[name]),
              }));
            }
          }}
        />
      </div>
    );
  }

  return <p>Unknown schema type</p>;
}

const nestedControlContainerStyle = css`
  background-color: ${COLORS.bgLight};
  padding: ${size(4)};
  ${STYLES.roundedCorners};
  ${STYLES.spacedFlex};
  flex-direction: column;
`;
