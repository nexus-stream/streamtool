import { Button } from "@mui/material";
import { useCallback } from "react";
import { useAppDispatch } from "../../../../data/hooks";
import { reloadAllTabs } from "../../../../data/app/appActions";

export function RefreshAllTabsButton() {
  const dispatch = useAppDispatch();
  const onClick = useCallback(() => {
    dispatch(reloadAllTabs());
  }, [dispatch]);

  return (
    <Button variant="outlined" size="small" onClick={onClick}>
      Refresh All Tabs
    </Button>
  );
}
