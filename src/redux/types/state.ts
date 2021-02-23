import { FeatureState } from "./feature"
import { InteractionState } from "./interactions"
import { LayerState } from "./layers";
import { OverlayState } from "./overlays";
import { RasterState } from "./raster";
import { ToolState } from "./tools";
import { UiState } from "./ui";
import { MapState } from "./map";

export interface GisState {
    Layers: LayerState
    Features: FeatureState
    Rasters: RasterState
    mantiSystems: any
    map: MapState
    Tools: ToolState
    Interactions: InteractionState
    Overlays: OverlayState
    ui: UiState
}