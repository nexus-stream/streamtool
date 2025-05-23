import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Route, Routes } from "react-router";
import { DockedPage } from "./pages/docked/DockedPage";
import { EditorPage } from "./pages/editor/EditorPage";
import { BrowserSourcePage } from "./pages/browser-source/BrowserSourcePage";
import { Provider } from "react-redux";
import store, { persistor } from "./data/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="dark">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DockedPage />} />
              <Route path="/edit" element={<EditorPage />} />
              <Route path="/frame/:frameId" element={<BrowserSourcePage />} />
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </Theme>
  </StrictMode>
);
