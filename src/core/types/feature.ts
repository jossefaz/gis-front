export interface IFeatureConfigInterface {
  type: string;
  coordinates: number[];
}

export interface Feature {
  properties: { [propertyName: string]: any };
  id: string;
  type: string;
  layerId: string;
  layerAlias: string;
  __Parent_NessUUID__: string;
}

export interface SelectedFeature {
  [layerName: string]: Feature[];
}
