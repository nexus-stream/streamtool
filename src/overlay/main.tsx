import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { OverlayLoader } from "./OverlayLoader.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <OverlayLoader />
    </Theme>
  </StrictMode>
);
