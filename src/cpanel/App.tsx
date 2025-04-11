import { Flex, Text, Button } from "@radix-ui/themes";
import { useCallback } from "react";
import { OBSAdapter } from "../adapter/OBSAdapter";

export default function MyApp() {
  const updateName = useCallback(async () => {
    const adapter = await OBSAdapter.create(4455, "Pikachu1");
    await adapter.updateSceneName("Scene", "KyleWasHere");
  }, []);

  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes :)</Text>
      <Button onClick={updateName}>Let's go</Button>
    </Flex>
  );
}
