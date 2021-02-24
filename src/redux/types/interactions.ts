import { InteractionSupportedTypes } from "../../nessMapping/types/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

interface InteractionMetadata {
  Type: InteractionSupportedTypes;
  widgetName: string;
  uuid?: string;
  status: number;
  interactionConfig?: { [type: string]: string };
  sourceLayer?: VectorSource;
  Layer?: VectorLayer;
}

interface InteractionWidgetItem {
  [mapUUID: string]: {
    [interactionName: string]: InteractionMetadata | boolean;
    focused: boolean;
  };
}

export interface InteractionState {
  [widgetName: string]: InteractionWidgetItem;
}
