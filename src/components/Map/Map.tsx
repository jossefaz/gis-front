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

const { getFocusedMap, getFocusedMapUUID } = API.map;
const MapComponent: FC = () => {
  const WIDGET_NAME = "Map";
  const interactions = new InteractionUtil(WIDGET_NAME);
  const vlregistry = VectorLayerRegistry.getInstance();
  const storeTools = useTypedSelector(
    (state) => state.Tools[getFocusedMapUUID()]
  );
  const visibleLayers = useTypedSelector(selectVisibleLayers);
  const currentInteraction = useTypedSelector(selectCurrentInteractions);
  const { setSelectedFeatures, toggleToolByName, setRaster } = useActions();
  const [currentLayers, setcurrentLayers] = useState<string[]>([]);
  const openedTools =
    storeTools.stickyTool.length > 0 ||
    storeTools.dynamicTools.length > 0 ||
    Object.keys(currentInteraction).length > 0;

  const onBoxEnd = () => {
    if (interactions.currentDragBoxUUID) {
      const dragBox = interactions.currentDragBox;
      const endListener = (dragBox: DragBox) => {
        const extent = dragBox.getGeometry().getExtent();
        const features = vlregistry.getFeaturesByExtent(extent);
        if (Object.keys(features).length > 0) {
          setSelectedFeatures(features);
          toggleToolByName("Identify", true, false);
        }
      };
      if (dragBox) {
        dragBox.on("boxend", () => endListener(dragBox));
      }
    }
  };

  const defaultClickTool = async (e: MapBrowserEvent<UIEvent>) => {
    if (!openedTools && Object.keys(currentInteraction).length === 0) {
      interactions.newDragBox(shiftKeyOnly);
      onBoxEnd();
      const extent = buffer(boundingExtent([e.coordinate]), 10);
      const features = vlregistry.getFeaturesByExtent(extent);
      if (Object.keys(features).length > 0) {
        setSelectedFeatures(features);
        toggleToolByName("Identify", true, false);
      }
    } else {
      interactions.unDragBox();
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
    if (!openedTools) {
      getFocusedMap().on("click", defaultClickTool);
    }
  });

  useEffect(() => {
    return () => {
      interactions.unDragBox();
    };
  }, []);

  return <div id="map" className="map"></div>;
};

export default MapComponent;
