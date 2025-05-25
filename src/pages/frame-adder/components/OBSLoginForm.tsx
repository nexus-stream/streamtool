import {
  Button,
  Card,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  initialPort: number;
  initialPassword: string;
  isError: boolean;
  onSubmit: (data: { port: number; password: string }) => void;
}

export function OBSLoginForm({
  initialPort,
  initialPassword,
  isError,
  onSubmit,
}: Props) {
  const [port, setPort] = useState(initialPort);
  const [password, setPassword] = useState(initialPassword);

  return (
    <Card className="p-8">
      <FormControl fullWidth className="flex flex-col gap-8">
        <h2>Log in to OBS Websocket Server</h2>

        <TextField
          type="number"
          label="Port"
          value={port}
          onChange={(event) => setPort(parseInt(event.target.value))}
        />

        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {isError && <FormHelperText>Login failed, try again.</FormHelperText>}

        <Button
          variant="outlined"
          onClick={() => {
            onSubmit({ port, password });
          }}
        >
          Login
        </Button>
      </FormControl>
    </Card>
  );
}
