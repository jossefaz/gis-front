import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { getFocusedMap } from "../nessMapping/api";
import mapStyle from "../nessMapping/mapStyle";
import { Draw, DragBox, Select, Modify } from "ol/interaction";

export const getEmptyVectorLayer = (inStyle) => {
  const style = inStyle || mapStyle.draw;
  const source = new VectorSource();
  const vector = new VectorLayer({ source, style });
  return { source, vector };
};

export const getDrawObject = (source, type) => {
  return new Draw({
    source: source,
    type: type,
    style: mapStyle.DRAW_START,
  });
};

export const newDraw = (drawType, vectorSource, Layer) => {
  if (!vectorSource) {
    const { source, vector } = getEmptyVectorLayer();
    getFocusedMap().addLayer(vector);
    vectorSource = source;
    Layer = vector;
  }
  const Interaction = getDrawObject(vectorSource, drawType);
  return { Interaction, vectorSource, Layer };
};

export const newSelect = (config) => {
  if (config) {
    return new Select(config);
  }
  return new Select();
};

export const newDragBox = (config) => {
  if (config) {
    return new DragBox(config);
  }
  return new DragBox();
};

export const newModify = (config) => {
  if (config) {
    return new Modify(config);
  }
  return new Modify();
};

/**
 * Get all interactions that belongs to this widget and this current map.
 * If there is no interactions in the current map with the current widget,
 * This function return false
 */

export const getWidgetInteractions = (
  widgetname,
  interactionstore,
  mapuuid
) => {
  if (
    widgetname in interactionstore &&
    mapuuid in interactionstore[widgetname]
  ) {
    return interactionstore[widgetname][mapuuid];
  }
  return false;
};

/**
 *  Return an object of interaction that will be consume by the Redux store
 * @param {string} uuid uuid of this interaction given by the InteractionProxy of NessMapping
 * @param {*} widgetName the widgetName that own this interation
 * @param {*} Type the interaction type
 */
export const getInteractionConfig = (uuid, widgetName, Type) => {
  return { uuid, widgetName, Type };
};
