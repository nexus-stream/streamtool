import { useSelector } from "react-redux";
import { selectCurrentFlattenedDisplayData } from "../../data/display/selectors";

export function FlatStagePage() {
  const data = useSelector(selectCurrentFlattenedDisplayData);

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
