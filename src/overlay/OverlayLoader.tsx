import { Text } from "@radix-ui/themes";
import { useOBSOverlayInfo } from "./adapter/useOBSOverlayInfo";
import { useQueryParam } from "./useQueryParam";

export function OverlayLoader() {
  const port = parseInt(useQueryParam("port"));
  const password = useQueryParam("password");
  const overlayInfo = useOBSOverlayInfo(port, password);

  return (
    <Text>{overlayInfo ? JSON.stringify(overlayInfo) : "Connecting..."}</Text>
  );
}
