import { useSelector } from "react-redux";
import { raceSelectors } from "../../../data/races/selectors";
import { selectCurrentStage } from "../../../data/stages/selectors";
import { userSelectors } from "../../../data/users/selectors";

export function AllData() {
  const stage = useSelector(selectCurrentStage);
  const raceId = stage?.kind === "race" ? stage.raceId : "";
  const race = useSelector(raceSelectors.selectEntities)[raceId];
  const users = useSelector(userSelectors.selectEntities);
  const raceUsers = race?.participants?.map(
    (participant) => users[participant.user]
  );

  return (
    <div>
      <pre>{JSON.stringify({ race, users: raceUsers }, null, 2)}</pre>
    </div>
  );
}
