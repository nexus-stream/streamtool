import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectIsAdminView } from "../../../data/config/selectors";

interface Props {
  children: ReactNode;
}

export function AdminContainer({ children }: Props) {
  const isAdminView = useSelector(selectIsAdminView);

  if (!isAdminView) {
    return null;
  }

  return children;
}
