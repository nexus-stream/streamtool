import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Page({ children }: Props) {
  return <div className="h-full w-full p-4">{children}</div>;
}
