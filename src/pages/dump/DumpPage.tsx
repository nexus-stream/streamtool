import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

export function DumpPage() {
  const raceId = useParams().raceId!;
  const [dumpValue, setDumpValue] = useState("");

  useEffect(() => {
    const ws = new WebSocket(buildWebsocketEndpoint(raceId));
    ws.addEventListener("message", (event) => {
      setDumpValue((oldValue) => {
        return `${oldValue}\n--------\n${JSON.stringify(event.data)}`;
      });
    });

    return () => {
      ws.close();
    };
  }, [raceId]);

  const onClick = useCallback(() => {
    downloadStringAsTxtFile(dumpValue, "dump.txt");
  }, [dumpValue]);

  return (
    <div>
      <textarea>{dumpValue}</textarea>
      <button onClick={onClick}>Save output</button>
    </div>
  );
}

function buildWebsocketEndpoint(raceId: string): string {
  return `wss://ws.therun.gg?race=${raceId}`;
}

function downloadStringAsTxtFile(text: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
