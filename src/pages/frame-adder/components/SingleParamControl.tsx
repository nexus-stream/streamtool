import { z } from "zod/v4";
import { NumberParamControl } from "./NumberParamControl";
import { StringParamControl } from "./StringParamControl";
import { EnumParamControl } from "./EnumParamControl";

interface Props {
  name: string;
  schemaValue: unknown;
  params: object;
  setParams: React.Dispatch<React.SetStateAction<object>>;
}

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

  return <p>Unknown schema type</p>;
}
