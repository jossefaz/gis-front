import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import {
  getFocusedMap,
  getFocusedMapProxy,
  getInteractionGraphicLayer,
  getInteractionVectorSource,
  getInteraction,
} from "../core/api";
import mapStyle from "../core/mapStyle";
import { Draw, DragBox, Select, Modify } from "ol/interaction";
import store from "../redux/store.ts";
import {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
  setInteractions,
} from "../redux/actions/interaction";
import Collection from "ol/Collection";
import GenerateUUID from "./uuid";
import styles from "../core/mapStyle";
import { Options as SelectOptions } from "ol/interaction/Select";
import { Options as DragBoxOptions } from "ol/interaction/DragBox";
import { Options as ModifyOptions } from "ol/interaction/Modify";
import { Options as DrawOptions } from "ol/interaction/Draw";
import Feature from "ol/Feature";
import { InteractionSupportedTypes as INTERACTION_TYPE } from "../core/types/interaction";

export class InteractionUtil {
  private _widget: string;

  constructor(widgetName: string) {
    this._widget = widgetName;
  }

  get store() {
    const currentInteractionStore = store.getState().Interactions;
    if (
      this._widget in currentInteractionStore &&
      this.currentMapUUID in currentInteractionStore[this._widget]
    ) {
      return currentInteractionStore[this._widget][this.currentMapUUID];
    }
    return false;
  }

  getinteractionUUID = (interaction: INTERACTION_TYPE): string | boolean => {
    if (this.store && interaction in this.store) {
      return this.store[interaction].uuid;
    }
    return false;
  };

  get currentDrawUUID() {
    return this.getinteractionUUID(INTERACTION_TYPE.DRAW);
  }

  get currentSelectUUID() {
    return this.getinteractionUUID(INTERACTION_TYPE.SELECT);
  }

  get currentModifyUUID() {
    return this.getinteractionUUID(INTERACTION_TYPE.MODIFY);
  }

  get currentDragBoxUUID() {
    return this.getinteractionUUID(INTERACTION_TYPE.DRAGBOX);
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

  getVectorLayer = (interaction: INTERACTION_TYPE) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    return currentInteractionUUID
      ? getInteractionGraphicLayer(currentInteractionUUID)
      : null;
  };

  getVectorSource = (interaction: INTERACTION_TYPE) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    return currentInteractionUUID
      ? getInteractionVectorSource(currentInteractionUUID)
      : null;
  };

  newDraw = async (drawConfig: DrawOptions) => {
    await this.unDraw();
    await store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.DRAW,
        interactionConfig: drawConfig,
        sourceLayer: this.getVectorSource(INTERACTION_TYPE.DRAW),
        Layer: this.getVectorLayer(INTERACTION_TYPE.DRAW),
        widgetName: this._widget,
      })
    );
  };

  unDraw = async (removePreviousLayer?: boolean) => {
    if (this.currentDrawUUID) {
      this.getVectorLayer(INTERACTION_TYPE.DRAW) &&
        removePreviousLayer &&
        getFocusedMap().removeLayer(this.getVectorLayer(INTERACTION_TYPE.DRAW));
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentDrawUUID,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.DRAW,
        })
      );
    }
  };

  newSelect = async (selectOptions: SelectOptions) => {
    await this.unSelect();
    await store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.SELECT,
        interactionConfig: selectOptions,
        widgetName: this._widget,
      })
    );
  };

  unSelect = async () => {
    if (this.currentSelectUUID) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentSelectUUID,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.SELECT,
        })
      );
    }
  };

  newModify = async (modifyOptions: ModifyOptions) => {
    await this.unModify();
    await store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.MODIFY,
        interactionConfig: modifyOptions,
        widgetName: this._widget,
      })
    );
  };

  unModify = async () => {
    if (this.currentModifyUUID) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentModifyUUID,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.MODIFY,
        })
      );
    }
  };

  unsetAll = async () => {
    if (this.store) {
      const InteractionArray = [];
      Object.keys(this.store).map((InteractionName) => {
        const { uuid, Type } = this.store[InteractionName];
        InteractionArray.push({ uuid, widgetName: this._widget, Type });
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
            widgetName: this._widget,
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
        Type: INTERACTION_TYPE.DRAGBOX,
        widgetName: this._widget,
      })
    );
  };

  unDragBox = async () => {
    if (this.currentDragBox) {
      await store.dispatch(
        unsetInteraction({
          uuid: this.currentDragBoxUUID,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.DRAGBOX,
        })
      );
    }
  };
}

export const getEmptyVectorLayer = (inStyle) => {
  const style = inStyle || mapStyle.draw;
  const source = new VectorSource();
  const vector = new VectorLayer({ source, style });
  const uuid = GenerateUUID();
  source.set("__NessUUID__", uuid);
  vector.set("__NessUUID__", uuid);
  return { source, vector };
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
