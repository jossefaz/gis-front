import React, { useEffect, useRef, useState } from "react";

import { useTypedSelector } from "../../../hooks/useTypedSelectors";
import { selectFocusedMapTools } from "../../../state/reducers";
import { useActions } from "../../../hooks/useActions";

interface IWidget {
  onFocus: () => void;
  onReset: () => void;
  onUnfocus: () => void;
}

export default (WrappedComponent: any) => {
  const WithWidgetLifeCycle: React.FC<{ toolID: string }> = (props) => {
    const child = useRef<IWidget>();
    const [focused, setfocused] = useState<string | null>(null);
    const Tools = useTypedSelector(selectFocusedMapTools);
    const { unsetUnfocused } = useActions();
    const { toolID } = props;
    useEffect(() => {
      if (child.current) {
        const { onFocus, onReset, onUnfocus } = child.current;

        if (Tools) {
          if (Tools.unfocus == toolID && typeof onUnfocus == "function") {
            onUnfocus();
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
      }
    });

    return <WrappedComponent ref={child} {...props} />;
  };
  return WithWidgetLifeCycle;
};
