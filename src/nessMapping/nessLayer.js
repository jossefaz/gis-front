/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import GenerateUUID from "../utils/uuid";
import MapProxy from "./mapProxy";

import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import { ImageArcGISRest } from "ol/source";

import { MDUtils as md } from "../utils/metadataUtils";
import { LYRUtils as lu } from "../utils/layerUtils";
import NessKeys from "./keys";

export default class NessLayer {
  constructor(mdId = null, alias = null, lyr = null, json = null) {
    this.uuid = null;
    this.mapIndex = -1;
    this.parent = null;

    var nl =
      md.getMDLayerFromJson(json) ||
      md.getMDLayerById(mdId) ||
      lu.getMDLayerByObject(lyr);
    if (nl) {
      // must-have props
      var uuid = {
        value: GenerateUUID(),
      };
      Object.freeze(uuid); // freeze uuid, it is too important !
      this.uuid = uuid;

      this.semanticId = nl.semanticId;
      this.displayExpression = nl.displayExpression;

      // must-have layer configuration props
      this.config = nl.config;

      // LayerList props
      this.alias = alias || nl.alias;
    } else {
      throw "NessLayer constructor failed";
    }
  }

  RefreshMapIndex() {
    this.mapIndex = -1;

    if (this.parent && this.parent.OLMap && this.uuid) {
      this.mapIndex = _getMapIndex(this);
    }

    return this.mapIndex;
  }

  AddSelfToMap(parent) {
    var okToAdd = false;
    if (this.parent && this.parent.OLMap) {
      // we already have an existing parent. check sanity
      this.RefreshMapIndex();
      if (this.mapIndex < 0) {
        okToAdd = true;
      } else {
        throw "layer already exists in map";
      }
    } else if (parent instanceof MapProxy && parent.OLMap) {
      // no parent, set parent and add
      this.parent = parent;
      this.parent._layers.push(this);
      okToAdd = true;
    }

    if (okToAdd) {
      var olLayer = _toOLLayer(this);

      if (olLayer) {
        // add the layer to the map
        this.parent.OLMap.addLayer(olLayer);

        // OK, layer is in! set uuid
        olLayer.set(NessKeys.NESS_LAYER_UUID_KEY, this.uuid.value, true);

        // and now refresh mapIndex
        this.RefreshMapIndex();

        // TODO: register to removeLayer event on map (just in case...)

        return true;
      } else {
        throw "AddLayer failed - layer not created correctly";
      }
    }
  }
}

////////////////////////////////////////////////////////
// "privates"
////////////////////////////////////////////////////////
const _toOLLayer = (nl) => {
  // TODO: init a propper OpenLayers Layer object and return it

  var newLyr = null;
  var newSrc = null;

  switch (nl.config.SourceType) {
    case "OL_ImageArcGISRest":
      newSrc = new ImageArcGISRest(nl.config.SourceOptions);
      break;
  }

  switch (nl.config.LayerType) {
    case "OL_TileLayer":
      break;
    case "OL_ImageLayer":
      newLyr = new ImageLayer({
        source: new ImageWMS({
          url: nl.config.SourceOptions.url,
          params: nl.config.SourceOptions.params,
          serverType: "geoserver",
        }),
      });
      newLyr.alias = nl.title;
      break;
    case "OL_VectorLayer":
      break;
    case "OL_Heatmap":
      break;
    case "OL_Graticule":
      break;
    case "OL_VectorTileLayer":
      break;
    case "OL_VectorImageLayer":
      break;
  }

  if (!newLyr) {
    throw "Failed creating OL layer";
  }

  return newLyr;
};

const _getMapIndex = (nl) => {
  if (nl instanceof NessLayer && nl.uuid && nl.parent && nl.parent.OLMap) {
    var lyrs = nl.parent.OLMap.getLayers().getArray();
    for (var i = 0; i < lyrs.length; i++) {
      if (lyrs[i].get(NessKeys.NESS_LAYER_UUID_KEY) === nl.uuid.value) {
        return i;
      }
    }
  }

  return -1;
};
export const getLayerObject = (layerId, OLMap) => {
  if (layerId) {
    const layers = OLMap.getLayers().getArray();
    return layers.find(
      (layer) => layer.get(NessKeys.NESS_LAYER_UUID_KEY) === layerId
    );
  }
  return -1;
};
export const deleteLayerObject = (layer, OLMap) => {
  try {
    OLMap.removeLayer(layer);
    return true;
  } catch (error) {
    return -1;
  }
};
export const setVisible = (uuid, OLMap, visibilty) => {
  var layer = getLayerObject(uuid, OLMap);
  if (layer !== -1) {
    layer.setVisible(visibilty);
    return true;
  }
  return false;
};
export const getVisible = (uuid, OLMap) => {
  var layer = getLayerObject(uuid, OLMap);
  if (layer !== -1) {
    return layer.getVisible();
  }
  return -1;
};
export const setOpacity = (uuid, OLMap, opacity) => {
  var layer = getLayerObject(uuid, OLMap);
  if (layer !== -1) {
    layer.setOpacity(opacity);
    return true;
  }
  return false;
};
export const getOpacity = (uuid, OLMap) => {
  var layer = getLayerObject(uuid, OLMap);
  if (layer !== -1) {
    return layer.getOpacity();
  }
  return -1;
};
