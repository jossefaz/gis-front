import React, { useState } from "react";
import { useEffect } from "react";
import { Tab } from "semantic-ui-react";
import API from "../../core/api";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelectors";

import "./style.css";

interface TabProps {
  menuItem: string;
  uuid: string;
  pane: JSX.Element;
}

const MapTabs: React.FC = () => {
  const [panes, setPanes] = useState<TabProps[]>([]);
  const [focused, setFocused] = useState("");
  const {
    resetTools,
    InitMap,
    InitLayers,
    setMapFocus,
    toolsReseted,
  } = useActions();
  const mapState = useTypedSelector((state) => state.map);
  const handleTabChange = (uuid: string) => {
    if (uuid != focused) {
      resetTools();
      if (uuid == "+") {
        InitMap();
        InitLayers();
      } else {
        setMapFocus(uuid);
        API.map.getFocusedMap().setTarget("map");
      }
      toolsReseted();
    }
  };
  const renderPanes = () => {
    const panes = [];
    if (mapState.uuids) {
      mapState.uuids.map((uuid, index) =>
        panes.push({
          menuItem: `Map-${index + 1}`,
          uuid,
          render: () => null,
        })
      );
      panes.push({
        menuItem: "+",
        uuid: "+",
        pane: <div key={"addmap"}></div>,
      });
    }
    if (mapState.focused) {
      API.map.getFocusedMap().setTarget("map");
    }
    setPanes(panes);
    setFocused(mapState.focused);
  };
  const shouldRender = () => {
    const uuids = mapState.uuids.length;
    const nextStatepanes = panes.length - 1;
    const nextFocused = mapState.focused;
    return uuids != nextStatepanes || focused != nextFocused;
  };

  useEffect(() => {
    shouldRender() && renderPanes();
  });
  return (
    <Tab
      menu={{ attached: "top" }}
      panes={panes}
      className="mapTab"
      onTabChange={(e, meta) => {
        const panes = meta.panes as TabProps[];
        const activeIndex = meta.activeIndex;
        panes &&
          typeof activeIndex == "number" &&
          handleTabChange(panes[activeIndex].uuid);
      }}
    />
  );
};

// shouldComponentUpdate(nextProps, nextState) {
//   const uuids = nextProps.maps.uuids.length;
//   const nextStatepanes = this.state.panes.length - 1;
//   const prevFocused = this.state.focused;
//   const nextFocused = nextProps.maps.focused;
//   return uuids != nextStatepanes || prevFocused != nextFocused;
// }

export default React.memo(MapTabs, (props, nextProps) => {
  return true;
});
