import { useTypedSelector } from "./useTypedSelectors";
import { selectFocusedMapTools } from "../state/reducers";
import { useEffect, useState } from "react";
import { useActions } from "./useActions";
const useWidgetLifeCycle = (toolID: string) => {
  const [focused, setfocused] = useState<string | null>(null);
  const [onFocus, setOnFocus] = useState<() => void | undefined>();
  const [onUnFocus, setonUnFocus] = useState<() => void | undefined>();
  const [onReset, setonReset] = useState<() => void | undefined>();
  const Tools = useTypedSelector(selectFocusedMapTools);
  const { unsetUnfocused } = useActions();

  useEffect(() => {
    if (Tools) {
      if (Tools.unfocus == toolID && typeof onUnFocus == "function") {
        onUnFocus();
        unsetUnfocused(toolID);
      }
      if (
        Tools.focused == toolID &&
        typeof onFocus == "function" &&
        focused !== Tools.focused
      ) {
        onFocus();
        setfocused(Tools.focused);
      }
      if (Tools.reset.length > 0 && typeof onReset === "function") {
        Tools.reset.map((toolid) => {
          if (toolid === toolID) {
            onReset();
          }
        });
      }
    }
  });
  return {
    onToolFocus: setOnFocus,
    onToolUnFocus: setonUnFocus,
    onToolReset: setonReset,
  };
};

export default useWidgetLifeCycle;
