import { Options as OverlayOptions } from "ol/Overlay";

export type OverlayMetadata = { [property: string]: any } & {
  overlay?: OverlayOptions;
  widgetName: string;
  content?: string;
  selector?: string;
  uuid: string;
  property?: string;
  value?: string;
  element?: string;
};

export interface OverlaysMetadata {
  overlays: string[];
  widgetName: string;
}

interface OverlayWidgetItem {
  [mapUUID: string]: {
    [overlayUUID: string]: OverlayMetadata;
  } & { focused?: string };
}

export interface OverlayState {
  [widgetName: string]: OverlayWidgetItem;
}
