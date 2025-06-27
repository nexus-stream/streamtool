import { useMemo } from "react";
import { z } from "zod/v4";
import { SingleParamControl } from "./SingleParamControl";

interface Props {
  schema: z.ZodObject;
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
}

// Builds a form control for each entry in the given frame's params.
export function FrameParamControls({ schema, params, setParams }: Props) {
  const shapeEntries = useMemo(
    () => Object.entries(schema.shape),
    [schema.shape]
  );

  return (
    <>
      {shapeEntries.map(([key, value]) => {
        return (
          <SingleParamControl
            key={key}
            name={key}
            schemaValue={value}
            params={params}
            setParams={setParams}
          />
        );
      })}
    </>
  );
}
