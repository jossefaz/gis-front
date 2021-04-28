import React, { useEffect, useState } from "react";
import FeatureDetail from "./FeatureDetail";
import ContextMenu from "../../../ContextMenus";
import LayersList from "./LayersList";
import API from "../../../../core/api";
import {
  selectVisibleLayers,
  selectSelectedFeatures,
  selectCurrentFeature,
} from "../../../../state/reducers";
import "./identify.scss";
import VectorLayerRegistry from "../../../../core/proxymanagers/vectorlayer";
import { InteractionUtil } from "../../../../utils/interactions";
import EditProxy from "../../../../core/proxymanagers/edit";
import _ from "lodash";
import Collection from "ol/Collection";
import withNotifications from "../../../HOC/withNotifications";
import { Feature } from "../../../../core/types";
import { DragBox } from "ol/interaction";
import { useActions } from "../../../../hooks/useActions";
import { useTypedSelector } from "../../../../hooks/useTypedSelectors";
import useNotifications from "../../../../hooks/useNotifications";
const { getFocusedMap } = API.map;
const { zoomTo } = API.features;

const Identify: React.FC = () => {
  const WIDGET_NAME = "Identify";
  const [modifiedFeature, setModifiedFeature] = useState<Feature | null>(null);
  const [currentLayers, setcurrentLayers] = useState<string[]>([]);
  const interactions = new InteractionUtil(WIDGET_NAME);
  const vectorLayerRegistry = VectorLayerRegistry.getInstance();
  let editProxy = EditProxy.getInstance([]);
  const { setSelectedFeatures } = useActions();
  const Layers = useTypedSelector((state) => state.Layers);
  const currentFeature = useTypedSelector(selectCurrentFeature);
  const VisibleLayers = useTypedSelector(selectVisibleLayers);
  const SelectedFeatures = useTypedSelector(selectSelectedFeatures);
  const { errorNotification, successNotification } = useNotifications();

  const onBoxEnd = () => {
    if (interactions.currentDragBoxUUID) {
      const dragBox = interactions.currentDragBox;
      const endListener = (dragBox: DragBox) => {
        const extent = dragBox.getGeometry().getExtent();
        const features = vectorLayerRegistry.getFeaturesByExtent(extent);
        if (Object.keys(features).length > 0) {
          setSelectedFeatures(features);
        }
      };
      if (dragBox) {
        dragBox.on("boxend", () => endListener(dragBox));
      }
    }
  };
  const addInteraction = () => {
    interactions.newDragBox();
    onBoxEnd();
  };

  const removeInteraction = () => {
    interactions.unDragBox();
  };

  const autoClosingEditSession = async (layer: string, feature: Feature) => {
    if (feature) {
      const updated = await editProxy.registry[layer].save();
      if (updated) {
        successNotification("Successfully saved feature !");
        interactions.unModify();
        addInteraction();
      } else {
        errorNotification("Failed to save feature !");
      }
    }
  };

  const onEditGeometry = (feature: Feature) => {
    removeInteraction();
    const layer = feature.__Parent_NessUUID__;

    const f = editProxy.registry[layer].getFeatureById(feature.id);
    if (f) {
      const geometry = f.getGeometry();
      if (geometry) {
        zoomTo(geometry);
        editProxy.registry[layer].edit(f);
        interactions.newModify(new Collection([f]));
        getFocusedMap().on("dblclick", () =>
          autoClosingEditSession(layer, feature)
        );
      }
    }
  };
  const areVisibleLayersEquals = _.isEqual(currentLayers, VisibleLayers);
  useEffect(() => {
    if (SelectedFeatures) {
      editProxy = EditProxy.getInstance(VisibleLayers);
    }

    if (!areVisibleLayersEquals) {
      vectorLayerRegistry.initVectorLayers(VisibleLayers);
      setcurrentLayers(VisibleLayers);
    }
  }, [SelectedFeatures, areVisibleLayersEquals]);

  useEffect(() => {
    addInteraction();
    if (API.map.getFocusedMapUUID() in Layers) {
      setcurrentLayers([]);
    }
    return removeInteraction;
  }, []);

  return (
    <React.Fragment>
      {SelectedFeatures && Object.keys(SelectedFeatures).length > 0 ? (
        <div className="identify">
          <LayersList />
          {currentFeature && (
            <div className="side-extra-container">
              <FeatureDetail onEditGeometry={onEditGeometry} />
              <ContextMenu Feature={currentFeature} />
            </div>
          )}
        </div>
      ) : (
        <div className="px-tool py-3">
          <p>אנא בחרו יישויות ע"י סימון וגרירה על גבי המפה.</p>
          <p>במידה ואינכם רואים כלל שכבות, יש לבחור שכבות פעילות.</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default withNotifications(Identify);
