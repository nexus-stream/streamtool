import { useSelector } from "react-redux";
import { stageSelectors } from "../../data/stages/selectors";

export function DockedPage() {
  const stages = useSelector(stageSelectors.selectAll);

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
