import React from "react";
import {
  selectVisibleLayers,
  selectCurrentInteractions,
} from "../../state/reducers";
import MapComp from "../../components/Map/Map";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import { useActions } from "../../hooks/useActions";

const MapComponent: React.FC = () => {
  const { setRaster, toggleToolByName, setSelectedFeatures } = useActions();

  const mapProps = {
    VisibleLayers: useTypedSelector((state) => selectVisibleLayers(state)),
    CurrentInteractions: useTypedSelector((state) =>
      selectCurrentInteractions(state)
    ),
    Layers: useTypedSelector((state) => state.Layers),
    Tools: useTypedSelector((state) => state.Tools),
    map: useTypedSelector((state) => state.map),
    setRaster,
    toggleToolByName,
    setSelectedFeatures,
  };

  return <MapComp {...mapProps} />;
};

export default MapComponent;
