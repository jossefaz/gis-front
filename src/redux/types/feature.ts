export interface Feature {
    properties: { [propertyName: string]: any };
    id: string;
    type: string;
    __Parent_NessUUID__: string;
}

export interface SelectedFeatureActionPayload {
    focusedmap: string
    featuresByLayers: { [layerid: string]: Feature[] }
}

export interface CurrentFeatureActionPayload {
    focusedmap: string
    currentFeature: Feature
}

interface SelectedFeature {
    [layerName: string]: Feature[]
}


export interface FeatureState {
    [mapUUID: string]: {
        selectedFeatures: SelectedFeature
        currentLayer: string | null
        currentFeature: Feature | null
    }
}