export interface MapConfig {
  target: string;
  proj: string;
  center: number[];
  zoom: number;
}

export interface SearchProvider {
  url: string;
}

export interface SearchEngine {
  [providerName: string]: SearchProvider;
}

export interface ContextMenuProvider {
  url: string;
  path: string;
  status: number;
  configuration: { [key: string]: any };
}

export interface ContextMenus {
  [providerName: string]: ContextMenuProvider;
}

export interface Params {
  LAYERS: string;
}

export interface Tool {
  Id: number;
  ToolName: string;
  ToolTip: string;
  ToolImage: any;
  ToolIcon: string;
  ToolActionInvoker: string;
  ToolInvokerType: number;
  ToolTypeID: number;
  OnCreate: string;
  OnDestroy: string;
  ToolParams: string;
  ToolLocation: string;
  Order: number;
  IsAGroup: number;
  ToolGroupId: number;
  ToolContainer: string;
  IsOpen: number;
}

export interface Group {
  Id: number;
  GroupContainer: string;
  GroupName: string;
  GroupImage: string;
  IsOpen: number;
}

export interface Widgets {
  tools: Tool[];
  groups: Group[];
}

export interface Channels {
  name: string;
  type: string;
  Channel: string;
  reduxTarget: string;
  reduxFunction: string;
  idSourceKey: string;
  atrributeListKey: string;
  attributeKey: string;
  attributeValue: string;
  description: string;
}

export interface MetaDataApi {
  url: string;
}

export interface ConfigObject {
  MapConfig: MapConfig;
  Search: SearchEngine;
  ContextMenus: ContextMenus;
  Widgets: Widgets;
  channels: Channels;
  metaDataApi: MetaDataApi;
  mantiLayerUrl: string;
  geoserverUrl: string;
  Geoserver: string;
  MD_server: string;
}
