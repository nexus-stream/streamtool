import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { DockedPage } from "./pages/docked/DockedPage";
import { EditorPage } from "./pages/editor/EditorPage";
import { BrowserSourcePage } from "./pages/browser-source/BrowserSourcePage";
import { Provider } from "react-redux";
import store, { persistor } from "./data/store";
import { PersistGate } from "redux-persist/integration/react";
import { DumpPage } from "./pages/dump/DumpPage";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { FrameAdderPage } from "./pages/frame-adder/FrameAdderPage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";
import { ObsConnectPage } from "./pages/obs-connect/ObsConnectPage";
import { ProxyPage } from "./pages/proxy/ProxyPage";
import { TwitchWebhookPage } from "./pages/twitch-webhook/TwitchWebhookPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<DockedPage />} />
                <Route path="/connect" element={<ObsConnectPage />} />
                <Route path="/edit" element={<EditorPage />} />
                <Route path="/frame" element={<FrameAdderPage />} />
                <Route path="/frame/:frameId" element={<BrowserSourcePage />} />
                <Route path="/proxy" element={<ProxyPage />} />
                <Route path="/twitch" element={<TwitchWebhookPage />} />
                <Route path="/dump/:raceId" element={<DumpPage />} />
              </Routes>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);
