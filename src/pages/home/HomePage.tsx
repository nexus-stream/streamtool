import { css } from "@emotion/react";
import { STYLES } from "../../components/styles";

export function HomePage() {
  const dockOrigin =
    import.meta.env.VITE_HTTPS_ORIGIN ?? window.location.origin;
  const dockUrl = `${dockOrigin}/dock`;

  return <iframe css={frameStyle} src={dockUrl} />;
}

const frameStyle = css`
  display: block;
  ${STYLES.fullSize};
  border: none;
`;
