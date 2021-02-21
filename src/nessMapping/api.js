import store from "../redux/store.ts";
import NessMapping from "./mapping";
import NessLayer, {
  getLayerObject,
  deleteLayerObject,
  setVisible,
  getVisible,
  setOpacity,
  getOpacity,
} from "./nessLayer";
import NessOverlay from "./overlay";
import NessInteraction from "./interaction";

import {
  Point,
  MultiPoint,
  Polygon,
  MultiLineString,
  LineString,
  MultiPolygon,
  Circle,
} from "ol/geom";
import Feature from "ol/Feature";
import _ from "lodash";

import NessKeys from "./keys";

/**
 * Map API
 *
 */

//GET
export const getFocusedMap = () => {
  const state = store.getState();
  return NessMapping.getInstance().getMapProxy(state.map.focused).OLMap;
};
//GET PROXY OBJECT
export const getFocusedMapProxy = () => {
  const state = store.getState();
  return NessMapping.getInstance().getMapProxy(state.map.focused);
};

//GET RESOLUTION

export const getCurrentResolution = () => {
  return getFocusedMap().getView().getResolution();
};

export const getCurrentExtent = () => {
  return getFocusedMap().getView().calculateExtent();
};

export const getCurrentProjection = () => {
  return getFocusedMap().getView().getProjection();
};

export const getFeatureProperties = (ol_feature) => {
  const props = ol_feature.getProperties() || {};
  return _.omit(props, ["editable", "bbox", "geometry", "vector_source"]);
};

// ZOOM TO

export const geoserverFeatureToOLGeom = (config) => {
  const { type, coordinates } = config;
  let newGeometry = null;
  switch (type) {
    case "MultiPolygon":
      newGeometry = new MultiPolygon(coordinates);
      break;
    case "Point":
      newGeometry = new Point(coordinates);
      break;

    case "Polygon":
      newGeometry = new Polygon(coordinates);
      break;

    case "MultiLineString":
      newGeometry = new MultiLineString(coordinates);
      break;
    case "LineString":
      newGeometry = new LineString(coordinates);
      break;

    case "MultiPoint":
      newGeometry = new MultiPoint(coordinates);
      break;
    case "Circle":
      newGeometry = new Circle(coordinates);
    default:
      break;
  }
  return newGeometry;
};

export const InstanceOfGeometryClass = (geometry) => {
  if (
    geometry instanceof MultiPolygon ||
    geometry instanceof Point ||
    geometry instanceof Polygon ||
    geometry instanceof MultiLineString ||
    geometry instanceof LineString ||
    geometry instanceof MultiPoint ||
    geometry instanceof Circle
  )
    return true;

  return false;
};

export const zoomTo = (config) => {
  const newGeometry = InstanceOfGeometryClass(config)
    ? config
    : geoserverFeatureToOLGeom(config);
  if (newGeometry) {
    const view = getFocusedMap().getView();
    highlightFeature(config);
    view.fit(newGeometry, {
      padding: [850, 850, 850, 850],
      maxZoom: 12,
    });
  } else {
    console.log(config);
    throw "the config object provided to ZoomTo function does not match any geometry type";
  }
};

export const highlightFeature = (config) => {
  let Highlight = getFocusedMapProxy().Highlight;
  if (!Highlight) {
    getFocusedMapProxy().setHighLight();
    Highlight = getFocusedMapProxy().Highlight;
  }
  const source = getFocusedMapProxy().getVectorSource(Highlight.source);
  source.clear();
  const newGeometry = InstanceOfGeometryClass(config)
    ? config
    : geoserverFeatureToOLGeom(config);
  if (newGeometry) {
    source.addFeature(new Feature(newGeometry));
  }
};

export const unhighlightFeature = () => {
  let Highlight = getFocusedMapProxy().Highlight;
  if (Highlight) {
    const source = getFocusedMapProxy().getVectorSource(Highlight.source);
    source.clear();
  }
};

/**
 * LAYERS API
 *
 */

// GET Layer
export const getOlLayer = (uuid) => {
  return getLayerObject(uuid, getFocusedMap());
};
// GET OL Layers
export const getOlLayers = () => {
  return getFocusedMap().getLayers().getArray();
};
// GET Ness Layer
export const getNessLayer = (uuid) => {
  return getFocusedMapProxy()._layers.find(
    (layer) => layer.uuid.value === uuid
  );
};
// GET Ness Layers
export const getNessLayers = () => {
  return getFocusedMapProxy()._layers;
};

// SET add layer to map proxy object
export const addLayerToMapProxy = (mdId, alias, lyr, lyrConfig) => {
  const Layer = new NessLayer(mdId, alias, lyr, lyrConfig);
  const MapProxy = getFocusedMapProxy();
  if (MapProxy.AddLayer(Layer)) return Layer;
  return -1;
};

//SET add ness layer to OL map
export const addOlLayerToMap = (uuid, visible = true) => {
  const nessLyr = getNessLayer(uuid);
  if (nessLyr !== -1) {
    const MapProxy = getFocusedMapProxy();
    if (nessLyr.AddSelfToMap(MapProxy)) {
      var olLyr = getOlLayer(uuid);
      if (olLyr && olLyr !== -1) olLyr.setVisible(visible);
      return true;
    } else return false;
  }
  return false;
};

// DELETE
export const removeLayer = (overlay) => {
  return deleteLayerObject(overlay, getFocusedMap());
};

// SET VISIBLE
export const setLayerVisiblity = (uuid, visibilty) => {
  return setVisible(uuid, getFocusedMap(), visibilty);
};

// GET VISIBLE
export const getLayerVisiblity = (uuid) => {
  return getVisible(uuid, getFocusedMap());
};

// export const getVisibleLayers = () => {
//     const state = store.getState();
//     const layers = state.Layers[state.map.focused].layers
//     return Object.keys(layers).map((layerId) => {
//         let lyr = layers[layerId];
//         if (lyr.visible === true)
//             return lyr
//     });
// }

// SET OPACTIY
export const setLayerOpacity = (uuid, opacity) => {
  return setOpacity(uuid, getFocusedMap(), opacity);
};

// GET OPACTIY
export const getLayerOpacity = (uuid) => {
  return getOpacity(uuid, getFocusedMap());
};

/**
 * Interaction API
 *
 */
// GET
export const getInteraction = (uuid) => {
  return NessInteraction.getInstance().getInteractionProxy(uuid).OLInteraction;
};
export const getInteractionProxy = (uuid) => {
  return NessInteraction.getInstance().getInteractionProxy(uuid);
};
export const getInteractionVectorSource = (uuid) => {
  const vsuid = getInteractionProxy(uuid).OLInteraction.get(
    NessKeys.VECTOR_SOURCE
  );
  return getFocusedMapProxy().getVectorSource(vsuid);
};

export const getInteractionGraphicLayer = (uuid) => {
  const gluid = getInteractionProxy(uuid).OLInteraction.get(
    NessKeys.GRAPHIC_LAYER
  );
  return getFocusedMapProxy().getGraphicLayer(gluid);
};

// SET
export const addInteraction = (config) => {
  const InteractionProxy = NessInteraction.getInstance().addInteractionProxy(
    config
  );
  return InteractionProxy.AddSelfToMap(getFocusedMapProxy());
};

// DELETE
export const removeInteraction = (uuid) => {
  const InteractionProxy = NessInteraction.getInstance().getInteractionProxy(
    uuid
  );
  InteractionProxy.RemoveSelfFromMap();
  return true;
};

/**
 * OVERLAYS API
 *
 */

// GET
export const getOverlay = (uuid) => {
  const olp = NessOverlay.getInstance().getOverlayProxy(uuid);
  return olp.OLOverlay;
};

export const getOverlayProxy = (uuid) => {
  return NessOverlay.getInstance().getOverlayProxy(uuid);
};

// SET
export const addOverlay = (config) => {
  const OverlayProxy = NessOverlay.getInstance().addOverlayProxy(config);
  return OverlayProxy.AddSelfToMap(getFocusedMapProxy());
};

// DELETE
export const removeOverlay = (uuid) => {
  const OverlayProxy = NessOverlay.getInstance().getOverlayProxy(uuid);
  OverlayProxy.RemoveSelfFromMap();
  NessOverlay.getInstance().killOverlayProxy(uuid);
  return true;
};

const _getmap = (map_uuid) => {
  return map_uuid
    ? NessMapping.getInstance().getMapProxy(map_uuid).OLMap
    : getFocusedMap();
};
