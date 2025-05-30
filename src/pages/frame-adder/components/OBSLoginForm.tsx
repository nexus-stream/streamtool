import {
  Button,
  Card,
  css,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { padded, spacedFlex } from "../../../components/primitives";
import { COLORS } from "../../../style/theme";

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
    <Card>
      <FormControl fullWidth css={containerStyle}>
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

        {isError && (
          <FormHelperText>
            Login failed. Make sure{" "}
            <a css={linkStyle} href="/guide.png" target="_blank">
              the WebSocket server is enabled
            </a>{" "}
            and try again.
          </FormHelperText>
        )}

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

const containerStyle = css`
  ${spacedFlex};
  ${padded};
  flex-direction: column;
`;

const linkStyle = css`
  color: ${COLORS.link};
`;
