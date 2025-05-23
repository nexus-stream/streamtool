import { useSelector } from "react-redux";
import { stageSelectors } from "../../data/stages/selectors";
import { LiveUpdateManager } from "../../data/live-update/LiveUpdateManager";
import { ChangeEvent, useCallback, useState } from "react";
import { useAppDispatch } from "../../data/hooks";
import { createStageForRace } from "../../data/stages/thunks";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function DockedPage() {
  const stages = useSelector(stageSelectors.selectAll);

  // Add link to open editor in new window
  // Add link to open frame builder in new window
  return (
    <div>
      {stages.map((stage) => (
        <p>{stage.name}</p>
      ))}

      <DebugStageAdder />

      {/* Handles listening for race updates from therun.gg. Should only ever be running in one place. */}
      <LiveUpdateManager />
    </div>
  );
}

function DebugStageAdder() {
  const [raceId, setRaceId] = useState("");
  const dispatch = useAppDispatch();

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRaceId(event.target.value);
  }, []);

  const onClick = useCallback(() => {
    dispatch(
      createStageForRace({
        raceId,
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
      })
    );
  }, [dispatch, raceId]);

  return (
    <div>
      <input value={raceId} onChange={onChange} />
      <button onClick={onClick}>Add</button>
    </div>
  );
}
