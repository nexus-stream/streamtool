import { css } from "@emotion/react";
import { STYLES } from "../../components/styles";
import { useObsTunnelAddBrowserSourceListener } from "./useObsTunnelAddBrowserSourceListener";
import { useObsTunnelPingListener } from "./useObsTunnelPingListener";
import { useState } from "react";
import { ObsWebSocketProvider } from "../../data/obs/ObsWebSocketProvider";
import { FrameAutoResizer } from "../docked/components/FrameAutoResizer";

export function HomePage() {
  return (
    <ObsWebSocketProvider>
      <HomePageContent />

      {/* Handles auto resizing the browser source of frames that have opted into that behavior. Should only
          ever be running in one place. */}
      <FrameAutoResizer />
    </ObsWebSocketProvider>
  );
}

function HomePageContent() {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useObsTunnelAddBrowserSourceListener();
  useObsTunnelPingListener(iframe);

  const frameOrigin =
    import.meta.env.VITE_HTTPS_ORIGIN ?? window.location.origin;

  return (
    <div css={STYLES.fullSize}>
      <iframe ref={setIframe} css={iframeStyle} src={`${frameOrigin}/dock`} />
    </div>
  );
}

const iframeStyle = css`
  ${STYLES.fullSize};
  display: block;
  border: none;
`;
