import { useFlatData } from "../../data/display/useFlatData";

export function FlatStagePage() {
  const data = useFlatData();

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
