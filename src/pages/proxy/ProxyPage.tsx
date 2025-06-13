import { css } from "@emotion/react";
import { useSearchParams } from "react-router";
import { STYLES } from "../../components/styles";

export function ProxyPage() {
  const [searchParams] = useSearchParams();
  const src = searchParams.get("src");

  if (!src) {
    return null;
  }

  return (
    <div css={STYLES.fullSize}>
      <iframe css={iframeStyle} src={src} />
    </div>
  );
}

const iframeStyle = css`
  ${STYLES.fullSize};
  display: block;
  border: none;
`;
