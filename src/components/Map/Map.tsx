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
  const [menuFeatures, setMenuFeatures] = useState<SelectedFeature>({});
  const [clientXY, setclientXY] = useState<any[]>([]);
  const [currentLayers, setcurrentLayers] = useState<string[]>([]);
  const openedTools =
    storeTools.stickyTool.length > 0 || storeTools.dynamicTools.length > 0;

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

  const getFeaturesFromEvent = (e: MapBrowserEvent<UIEvent>) => {
    const extent = buffer(boundingExtent([e.coordinate]), 10);
    return vlregistry.getFeaturesByExtent(extent);
  };

  const defaultClickTool = (e: MapBrowserEvent<UIEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(`click`, e);
    if (!openedTools) {
      interactions.newDragBox(shiftKeyOnly);
      onBoxEnd();
      const features = getFeaturesFromEvent(e);
      if (Object.keys(features).length > 0) {
        setSelectedFeatures(features);
        toggleToolByName("Identify", true, false);
      }
    }
  };

  const defaultContextMenu = (e: MapBrowserEvent<UIEvent>) => {
    e.stopPropagation();
    e.preventDefault();
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
    getFocusedMap().on("pointerdown", defaultContextMenu);
    getFocusedMap().on("click", defaultClickTool);
    return () => {
      interactions.unDragBox();
    };
  }, []);

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
