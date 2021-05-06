import React, { FC, useEffect, useState } from "react";
import PropTypes from "prop-types";
import API from "../../core/api";
import VectorLayerRegistry from "../../core/proxymanagers/vectorlayer";
import _ from "lodash";
import { InteractionUtil } from "../../utils/interactions";
import { useTypedSelector } from "../../hooks/useTypedSelectors";
import {
  selectVisibleLayers,
  selectCurrentInteractions,
} from "../../state/reducers";
import { useActions } from "../../hooks/useActions";
import { shiftKeyOnly } from "ol/events/condition";
import { DragBox } from "ol/interaction";
import { boundingExtent, buffer } from "ol/extent";
import { MapBrowserEvent } from "ol";
import ContextMenuContainer from "../ContextMenus/Container";
import { Feature, SelectedFeature } from "../../core/types";
import { unByKey } from "ol/Observable";
import { EventsKey } from "ol/events";

const { getFocusedMap, getFocusedMapUUID } = API.map;
const MapComponent: FC = () => {
  const vlregistry = VectorLayerRegistry.getInstance();
  const storeTools = useTypedSelector(
    (state) => state.Tools[getFocusedMapUUID()]
  );
  const visibleLayers = useTypedSelector(selectVisibleLayers);
  const currentInteractions = useTypedSelector(selectCurrentInteractions);

  const currentInteractionsLength = Object.keys(currentInteractions).length;
  const { setSelectedFeatures, toggleToolByName, setRaster } = useActions();
  const [menuFeatures, setMenuFeatures] = useState<SelectedFeature>({});
  const [clientXY, setclientXY] = useState<any[]>([]);
  const [currentLayers, setcurrentLayers] = useState<string[]>([]);
  const [eventKeys, seteventKeys] = useState<(EventsKey | EventsKey[])[]>([]);
  const openedTools =
    storeTools.stickyTool.length > 0 || storeTools.dynamicTools.length > 0;

  const getFeaturesFromEvent = (e: MapBrowserEvent<UIEvent>) => {
    const extent = buffer(boundingExtent([e.coordinate]), 50);
    return vlregistry.getFeaturesByExtent(extent);
  };

  const defaultClickTool = (e: MapBrowserEvent<UIEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!openedTools) {
      const features = getFeaturesFromEvent(e);
      if (Object.keys(features).length > 0) {
        setSelectedFeatures(features);
        toggleToolByName("Identify", true, false);
        setMenuFeatures({});
      }
    }
  };

  const defaultContextMenu = (e: MapBrowserEvent<UIEvent>) => {
    if ((e.originalEvent as any).buttons == 2) {
      const features = getFeaturesFromEvent(e);
      if (Object.keys(features).length > 0) {
        const clientX = (e.originalEvent as any).clientX;
        const clientY = (e.originalEvent as any).clientY;
        setclientXY([clientX, clientY]);
        setMenuFeatures(features);
      }
    }
  };
  const areLayersEquals = _.isEqual(currentLayers, visibleLayers);

  useEffect(() => {
    if (getFocusedMap().getLayers().getArray().length == 0) {
      setRaster("osm");
    }
    if (!areLayersEquals) {
      vlregistry.initVectorLayers(visibleLayers);
      setcurrentLayers(visibleLayers);
    }
  });

  useEffect(() => {
    const map = getFocusedMap();
    if (
      !currentInteractionsLength ||
      (currentInteractionsLength === 1 && "Identify" in currentInteractions)
    ) {
      const clickKey = map.on("click", defaultClickTool);
      const poinnterDownKey = map.on("pointerdown", defaultContextMenu);
      const changeResKey = map
        .getView()
        .on("change:resolution", () => setMenuFeatures({}));
      const pointDragKey = map.on("pointerdrag", () => setMenuFeatures({}));
      seteventKeys([clickKey, poinnterDownKey, changeResKey, pointDragKey]);
    } else {
      eventKeys.map((ek) => unByKey(ek));
      seteventKeys([]);
      setMenuFeatures({});
    }
  }, [currentInteractionsLength]);

  return (
    <React.Fragment>
      {Object.keys(menuFeatures).length > 0 && (
        <ContextMenuContainer features={menuFeatures} clientXY={clientXY} />
      )}

      <div
        id="map"
        className="map"
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      ></div>
    </React.Fragment>
  );
};

export default MapComponent;
