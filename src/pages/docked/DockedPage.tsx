import { useSelector } from "react-redux";
import { stagesSelectors } from "../../data/stageSlice";

export function DockedPage() {
  const stages = useSelector(stagesSelectors.selectAll);

  // Add link to open editor in new window
  // Add link to open frame builder in new window
  return (
    <div>
      {stages.map((stage) => (
        <p>{stage.name}</p>
      ))}
    </div>
  );
}
