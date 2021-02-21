import { } from "ol/interaction";

interface InteractionMetadata {
    Type: string
    widgetName: string
    uuid: string
    status: number
    drawConfig?: { [type: string]: string }
}

interface InteractionWidgetItem {
    [mapUUID: string]: {
        [interactionName: string]: InteractionMetadata | boolean,
        focused: boolean
    }
}

export interface InteractionState {
    [widgetName: string]: InteractionWidgetItem
}