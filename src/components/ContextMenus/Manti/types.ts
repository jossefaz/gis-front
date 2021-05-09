enum ItemState {
  INITIAL = "INITIAL",
  AUDITED = "AUDITED",
  DELETED = "AUDITED",
}

export enum UITypes {
  string = "string",
  combo = "combo",
  date = "date",
  number = "number",
}

export interface Parameter {
  name: string;
  type: string;
  mandatory: boolean;
  value_source?: string;
  combo_source?: string;
  helper_function?: string;
  rule?: string;
  UItype: UITypes;
}

export type ParamTofes = Parameter[];

export interface layerProperties {
  type: string;
  layerId: string;
  layerAlias: string;
  uuid: string;
}

export interface IdentifyResult {
  properties: { [propertyName: string]: any };
  parentlayerProperties: layerProperties;
  id: any;
}

export interface MenuItem {
  AdaptorId: string;
  ID: number;
  LayerID: number;
  Name: string;
  Async: boolean;
  ConcurrentCopies: number;
  AdaptorCommand: string;
  timeOut: number;
  Parameters: string;
  AD_Groups: string;
  updateDate: Date;
  username: string;
  state: ItemState;
  description: string;
  categoryId: number;
  category: string;
  templateComponent: string;
}

export type MenuConfig = MenuItem[];
