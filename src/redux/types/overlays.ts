import { Options as OverlayOptions } from "ol/Overlay"


interface OverlayMetadata {
    overlay: OverlayOptions
    widgetName: string
    content: string
    selector: string
    uuid: string
}

interface OverlayWidgetItem {
    [mapUUID: string]: {
        [overlayUUID: string]: OverlayMetadata | boolean,
        focused: boolean
    }
}

export interface OverlayState {
    [widgetName: string]: OverlayWidgetItem
}






