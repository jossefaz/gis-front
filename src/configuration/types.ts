import { IconName } from "@fortawesome/fontawesome-svg-core";

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
  Id: string;
  ToolName: string;
  ToolTip: string;
  ToolImage: any;
  ToolIcon: IconName;
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
  IsOpen: boolean;
}

export interface Group {
  Id: string;
  GroupContainer: string;
  GroupName: string;
  GroupImage: string;
  IsOpen: boolean;
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
  authUrl: string;
}
