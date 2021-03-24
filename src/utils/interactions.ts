import API from "../core/api";

import { mainStore as store } from "../state/store";
import {
  setInteraction,
  unsetInteraction,
  unsetInteractions,
  setInteractions,
} from "../state/actions/interaction";
import { Options as SelectOptions } from "ol/interaction/Select";
import { Options as ModifyOptions } from "ol/interaction/Modify";
import { Options as DrawOptions } from "ol/interaction/Draw";
import {
  InteractionOptions,
  InteractionSupportedTypes as INTERACTION_TYPE,
} from "../core/types/interaction";
import { Collection, Feature } from "ol";
import BaseLayer from "ol/layer/Base";
import { Condition } from "ol/events/condition";
import styles from "../core/mapStyle";
import VectorSource from "ol/source/Vector";

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
    return {};
  }

  getinteractionUUID = (interaction: INTERACTION_TYPE): string | boolean => {
    if (this.store && interaction in this.store) {
      const uuid = this.store[interaction].uuid;
      return uuid ? uuid : false;
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
    return API.map.getFocusedMapUUID();
  }

  get currentDraw() {
    if (this.currentDrawUUID && typeof this.currentDrawUUID === "string") {
      return API.interactions.getInteraction(this.currentDrawUUID);
    }
    return false;
  }

  get currentSelect() {
    if (this.currentSelectUUID && typeof this.currentSelectUUID === "string") {
      return API.interactions.getInteraction(this.currentSelectUUID);
    }
    return false;
  }

  get currentModify() {
    if (this.currentModifyUUID && typeof this.currentModifyUUID === "string") {
      return API.interactions.getInteraction(this.currentModifyUUID);
    }
    return false;
  }

  get currentDragBox() {
    if (
      this.currentDragBoxUUID &&
      typeof this.currentDragBoxUUID === "string"
    ) {
      return API.interactions.getInteraction(this.currentDragBoxUUID);
    }
    return false;
  }

  getVectorLayer = (interaction: INTERACTION_TYPE) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    if (currentInteractionUUID && typeof currentInteractionUUID === "string") {
      const vl = API.interactions.getInteractionGraphicLayer(
        currentInteractionUUID
      );
      return vl ? vl : undefined;
    }
    return undefined;
  };

  getVectorSource = (interaction: INTERACTION_TYPE) => {
    const currentInteractionUUID = this.getinteractionUUID(interaction);
    if (currentInteractionUUID && typeof currentInteractionUUID === "string") {
      const vs = API.interactions.getInteractionVectorSource(
        currentInteractionUUID
      );
      return vs ? vs : undefined;
    }
    return undefined;
  };

  newDraw = (drawConfig: DrawOptions) => {
    this.unDraw();
    store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.DRAW,
        interactionConfig: drawConfig,
        sourceLayer: this.getVectorSource(INTERACTION_TYPE.DRAW),
        Layer: this.getVectorLayer(INTERACTION_TYPE.DRAW),
        widgetName: this._widget,
      }) as any
    );
  };

  unDraw = (removePreviousLayer?: boolean) => {
    if (this.currentDrawUUID) {
      const vl = this.getVectorLayer(INTERACTION_TYPE.DRAW);
      vl && removePreviousLayer && API.map.getFocusedMap().removeLayer(vl);
      const uuid = this.currentDrawUUID;
      if (typeof uuid === "string") {
        store.dispatch(
          unsetInteraction({
            uuid,
            widgetName: this._widget,
            Type: INTERACTION_TYPE.DRAW,
          }) as any
        );
      }
    }
  };

  newSelect = (
    feature: Feature,
    layers: BaseLayer[],
    multi: boolean,
    condition: Condition | undefined
  ) => {
    const config = {
      ...(layers && { layers }),
      ...(multi && { multi }),
      ...(feature && { features: new Collection([feature]) }),
      ...(condition && { condition }),
      style: styles.EDIT,
    };

    this.unSelect();
    store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.SELECT,
        interactionConfig: config,
        widgetName: this._widget,
      }) as any
    );
  };

  unSelect = () => {
    const uuid = this.currentSelectUUID;
    if (uuid && typeof uuid === "string") {
      store.dispatch(
        unsetInteraction({
          uuid,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.SELECT,
        }) as any
      );
    }
  };

  newModify = (features: Collection<Feature>) => {
    const config = {
      ...(features && { features }),
    };

    this.unModify();
    store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.MODIFY,
        interactionConfig: config,
        widgetName: this._widget,
      }) as any
    );
  };

  unModify = () => {
    const uuid = this.currentModifyUUID;
    if (uuid && typeof uuid === "string") {
      store.dispatch(
        unsetInteraction({
          uuid,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.MODIFY,
        }) as any
      );
    }
  };

  unsetAll = () => {
    if (Object.keys(this.store).length > 0) {
      const InteractionArray: InteractionOptions[] = [];
      Object.keys(this.store).map((InteractionName) => {
        const { uuid, Type } = this.store[InteractionName];
        InteractionArray.push({ uuid, widgetName: this._widget, Type });
      });
      if (InteractionArray.length > 0) {
        store.dispatch(unsetInteractions(InteractionArray) as any);
      }
    }
  };

  clearVectorSource = (type: INTERACTION_TYPE) => {
    const vs = this.getVectorSource(type);
    if (vs) {
      vs.clear();
    }
  };

  setAll = () => {
    if (this.store) {
      const InteractionArray: InteractionOptions[] = [];
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
        store.dispatch(setInteractions(InteractionArray) as any);
      }
    }
  };

  newDragBox = () => {
    this.unDragBox();
    store.dispatch(
      setInteraction({
        Type: INTERACTION_TYPE.DRAGBOX,
        widgetName: this._widget,
      }) as any
    );
  };

  unDragBox = () => {
    const uuid = this.currentDragBoxUUID;
    if (this.currentDragBox && uuid && typeof uuid === "string") {
      store.dispatch(
        unsetInteraction({
          uuid,
          widgetName: this._widget,
          Type: INTERACTION_TYPE.DRAGBOX,
        }) as any
      );
    }
  };
}
