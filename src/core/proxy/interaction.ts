/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import { GenerateUUID } from "../../utils/uuid";
import MapProxy from "./map";
import NessKeys from "../keys";
import { Select, DragBox, Modify, Draw } from "ol/interaction";
import { Interaction } from "ol/interaction";
import { Options as SelectOptions } from "ol/interaction/Select";
import { Options as DragBoxOptions } from "ol/interaction/DragBox";
import { Options as ModifyOptions } from "ol/interaction/Modify";
import { Options as DrawOptions } from "ol/interaction/Draw";
import {
  InteractionOptions,
  InteractionSupportedTypes as TYPES,
} from "../types/interaction";
import GeometryType from "ol/geom/GeometryType";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { getEmptyVectorLayer } from "../api/interaction";
import { getFocusedMap } from "../api/map";
import mapStyle from "../mapStyle";

export default class InteractionProxy {
  public uuid: { value: string };
  private _parentMap: MapProxy | null;
  private _config: InteractionOptions;
  private _olInteraction: Interaction | null;

  constructor(config: InteractionOptions) {
    this.uuid = Object.freeze({
      value: GenerateUUID(),
    });
    this._parentMap = null;
    this._config = config;
    this._olInteraction = null;
  }

  get OLInteraction() {
    return this._olInteraction;
  }

  get parentMap() {
    return this._parentMap ? this._parentMap : null;
  }

  private _castConfig<T>() {
    return this._config.interactionConfig as T;
  }

  private _toOLInteraction = () => {
    let olInteraction,
      sourceLayer,
      vLayer = null;

    switch (this._config.Type) {
      case TYPES.DRAW:
        const config = this._castConfig<DrawOptions>();
        const { Interaction, vectorSource, Layer } = this._newDraw(
          config.type,
          this._config.sourceLayer,
          this._config.Layer
        );
        olInteraction = Interaction;
        sourceLayer = vectorSource;
        vLayer = Layer;
        break;

      case TYPES.SELECT:
        olInteraction = this._newSelect(this._castConfig<SelectOptions>());
        break;
      case TYPES.DRAGBOX:
        olInteraction = this._newDragBox(this._castConfig<DragBoxOptions>());
        break;
      case TYPES.MODIFY:
        olInteraction = this._newModify(this._castConfig<ModifyOptions>());
        break;
    }
    if (!olInteraction) {
      throw "Failed creating OL Interaction";
    }
    return { olInteraction, sourceLayer, vLayer };
  };

  public addSelfToMap(parent: MapProxy) {
    if (!this.parentMap) {
      this._parentMap = parent;
    }
    if (this.parentMap) {
      const { olInteraction, sourceLayer, vLayer } = this._toOLInteraction();
      if (olInteraction) {
        // add the layer to the map
        this.parentMap.OLMap.addInteraction(olInteraction);

        olInteraction.set(NessKeys.NESS_INTERACTION_UUID_KEY, this.uuid.value);
        olInteraction.set(NessKeys.PARENT_UUID, this.parentMap.uuid.value);
        if (sourceLayer) {
          olInteraction.set(
            NessKeys.VECTOR_SOURCE,
            this.parentMap.setVectorSource(sourceLayer)
          );
        }
        if (vLayer) {
          olInteraction.set(
            NessKeys.GRAPHIC_LAYER,
            this.parentMap.setGraphicLayer(vLayer)
          );
        }

        this._olInteraction = olInteraction;
        return this.uuid.value;
      } else {
        throw "AddInteraction failed - Interaction not created correctly";
      }
    }
    return false;
  }

  private _newDraw = (
    drawType: GeometryType,
    vectorSource: VectorSource | undefined,
    Layer: VectorLayer | undefined
  ) => {
    if (!vectorSource) {
      const { source, vector } = getEmptyVectorLayer();
      getFocusedMap().addLayer(vector);
      vectorSource = source;
      Layer = vector;
      Layer.set("__NessUUID__", "drawlayer");
      vectorSource.set("__NessUUID__", "drawlayer");
    }
    const Interaction = new Draw({
      source: vectorSource,
      type: drawType,
      style: mapStyle.DRAW_START,
    });

    return { Interaction, vectorSource, Layer };
  };

  private _newSelect = (config: SelectOptions): Select => {
    if (config) {
      return new Select(config);
    }
    return new Select();
  };

  private _newDragBox = (config: DragBoxOptions): DragBox => {
    if (config) {
      return new DragBox(config);
    }
    return new DragBox();
  };

  private _newModify = (config: ModifyOptions): Modify | null => {
    if (config) {
      return new Modify(config);
    }
    return null;
  };

  RemoveSelfFromMap() {
    if (this.parentMap && this._olInteraction) {
      this.parentMap.OLMap.removeInteraction(this._olInteraction);
    }
  }
}
