import { Flex, Text } from "@radix-ui/themes";
import { ConnectWrapper } from "./ConnectWrapper";
import { RunInfo } from "../types";

export default function MyApp() {
  const runInfo: RunInfo = {
    runners: [],
    commentators: [],
    category: "",
    game: "Super Mario Galaxy",
    streamTitle: "Kyle Was Here!",
  };

  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes :)</Text>
      <ConnectWrapper runInfo={runInfo} />
    </Flex>
  );
}
