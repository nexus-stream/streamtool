import { Typography } from "@mui/material";
import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  className?: string;
  time: string;
}

export function ParticipantTimer({ className, time }: Props) {
  return (
    <Typography
      className={className}
      component={InnerSpan}
      alignContent="center"
    >
      {time}
    </Typography>
  );
}

function InnerSpan({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={classNames(
        className,
        "text-white font-[Roboto_Mono] text-lg font-bold"
      )}
    >
      {children}
    </span>
  );
}
