import React from "react";
import App from "../App";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelectors";

const AppContainer: React.FC = () => {
  const { InitLayers, InitMap, InitRasters, InitTools } = useActions();
  const map = useTypedSelector((state) => state.map);

  return (
    <App
      InitLayers={InitLayers}
      InitMap={InitMap}
      InitRasters={InitRasters}
      InitTools={InitTools}
      mapState={map}
    />
  );
};

export default AppContainer;
