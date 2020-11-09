import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import {
  getFocusedMap,
  getFocusedMapProxy,
  getInteractionGraphicLayer,
  getInteractionVectorSource,
  getInteraction,
} from "../nessMapping/api";
import mapStyle from "../nessMapping/mapStyle";
import { Draw, DragBox, Select, Modify } from "ol/interaction";
import store from "../redux/store";
import {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
  setInteractions,
} from "../redux/actions/interaction";
import Collection from "ol/Collection";

import { Style, Fill, Stroke, Circle } from "ol/style";

export class InteractionUtil {
  constructor(widgetName) {
    this.widget = widgetName;
    this.TYPES = {
      DRAW: "Draw",
      SELECT: "Select",
      MODIFY: "Modify",
      DRAGBOX: "DragBox",
    };
  }

  get store() {
    const currentInteractionStore = store.getState().Interactions;
    if (
      this.widget in currentInteractionStore &&
      this.currentMapUUID in currentInteractionStore[this.widget]
    ) {
      return currentInteractionStore[this.widget][this.currentMapUUID];
    }
    return false;
  }

  getinteractionUUID = (interaction) => {
    if (this.store && interaction in this.store) {
      return this.store[interaction].uuid;
    }
    return false;
  };

  get currentDrawUUID() {
    return this.getinteractionUUID(this.TYPES.DRAW);
  }

  get currentSelectUUID() {
    return this.getinteractionUUID(this.TYPES.SELECT);
  }

  get currentModifyUUID() {
    return this.getinteractionUUID(this.TYPES.MODIFY);
  }

  get currentDragBoxUUID() {
    return this.getinteractionUUID(this.TYPES.DRAGBOX);
  }

  get currentMapUUID() {
    return getFocusedMapProxy().uuid.value;
  }

  get currentDraw() {
    if (this.currentDrawUUID) {
      return getInteraction(this.currentDrawUUID);
    }
    return false;
  }

  get currentSelect() {
    if (this.currentSelectUUID) {
      return getInteraction(this.currentSelectUUID);
    }
    return false;
  }

  get currentModify() {
    if (this.currentModifyUUID) {
      return getInteraction(this.currentModifyUUID);
    }
    return false;
  }

  get currentDragBox() {
    if (this.currentDragBoxUUID) {
      return getInteraction(this.currentDragBoxUUID);
    }
    return false;
  }

  getVectorLayer = (interaction) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    return currentInteractionUUID
      ? getInteractionGraphicLayer(currentInteractionUUID)
      : null;
  };

  getVectorSource = (interaction) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    return currentInteractionUUID
      ? getInteractionVectorSource(currentInteractionUUID)
      : null;
  };

  newDraw = async (drawConfig) => {
    await this.unDraw();
    await store.dispatch(
      setInteraction({
        Type: this.TYPES.DRAW,
        drawConfig,
        sourceLayer: this.getVectorSource(this.TYPES.DRAW),
        Layer: this.getVectorLayer(this.TYPES.DRAW),
        widgetName: this.widget,
      })
    );
  };

  unDraw = async () => {
    if (this.currentDrawUUID) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentDrawUUID,
          widgetName: this.widget,
          Type: this.TYPES.DRAW,
        })
      );
    }
  };

  newSelect = async (feature, layers, multi, condition) => {
    const style = new Style({
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: [0, 153, 255, 1],
        }),
        stroke: new Stroke({
          color: [255, 255, 255, 0.75],
          width: 1.5,
        }),
      }),
      zIndex: 100000,
    });
    await this.unSelect();
    await store.dispatch(
      setInteraction({
        Type: this.TYPES.SELECT,
        interactionConfig: {
          wrapX: false,
          ...(layers && { layers }),
          ...(multi && { multi }),
          ...(feature && { features: new Collection([feature]) }),
          ...(condition && { condition }),
          style,
        },
        widgetName: this.widget,
      })
    );
  };

  unSelect = async () => {
    if (this.currentSelectUUID) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentSelectUUID,
          widgetName: this.widget,
          Type: this.TYPES.SELECT,
        })
      );
    }
  };

  newModify = async (features, source) => {
    await this.unModify();
    await store.dispatch(
      setInteraction({
        Type: this.TYPES.MODIFY,
        interactionConfig: {
          ...(features && { features }),
          ...(source && { source }),
        },
        widgetName: this.widget,
      })
    );
  };

  unModify = async () => {
    if (this.currentModifyUUID) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentModifyUUID,
          widgetName: this.widget,
          Type: this.TYPES.MODIFY,
        })
      );
    }
  };

  unsetAll = async () => {
    if (this.store) {
      const InteractionArray = [];
      Object.keys(this.store).map((InteractionName) => {
        const { uuid, Type } = this.store[InteractionName];
        InteractionArray.push({ uuid, widgetName: this.widget, Type });
      });
      if (InteractionArray.length > 0) {
        await store.dispatch(unsetInteractions(InteractionArray));
      }
    }
  };

  clearVectorSource = (type) => {
    if (this.getVectorSource(type)) {
      this.getVectorSource(type).clear();
    }
  };

  setAll = async () => {
    if (this.store) {
      const InteractionArray = [];
      Object.keys(this.store).map((InteractionName) => {
        const { Type, status, interactionConfig } = this.store[InteractionName];
        if (!status) {
          InteractionArray.push({
            Type: Type,
            widgetName: this.widget,
            interactionConfig: interactionConfig,
          });
        }
      });
      if (InteractionArray.length > 0) {
        await store.dispatch(setInteractions(InteractionArray));
      }
    }
  };

  newDragBox = async () => {
    this.unDragBox();

    await store.dispatch(
      setInteraction({
        Type: this.TYPES.DRAGBOX,
        widgetName: this.widget,
      })
    );
  };

  unDragBox = async () => {
    if (this.currentDragBox) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentDragBoxUUID,
          widgetName: this.widget,
          Type: this.TYPES.DRAGBOX,
        })
      );
    }
  };
}

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
    Layer.set("ref_name", "drawlayer");
    vectorSource.set("ref_name", "drawlayer");
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
