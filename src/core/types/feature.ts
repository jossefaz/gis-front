export interface IFeatureConfigInterface {
  type: string;
  coordinates: number[];
}

export interface layerProperties {
  type: string;
  layerId: string;
  layerAlias: string;
  uuid: string;
}

export interface Feature {
  properties: { [propertyName: string]: any };
  parentlayerProperties: layerProperties;
  id: any;
}

export interface SelectedFeature {
  [layerName: string]: Feature[];
}
