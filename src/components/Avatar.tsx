import classNames from "classnames";
import AvatarFallback from "../assets/avatar-fallback.png";

interface Props {
  src: string | null | undefined;
  size: "small" | "medium" | "large";
}

export function Avatar({ src, size }: Props) {
  return (
    <img
      className={classNames("rounded-md", {
        "w-8 h-8": size === "small",
        "w-12 h-12": size === "medium",
        "w-16 h-16": size === "large",
      })}
      src={src ?? AvatarFallback}
    />
  );
}
