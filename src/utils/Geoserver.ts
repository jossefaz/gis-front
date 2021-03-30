import API from "../core/api";
import axios from "axios";
import { WFS } from "ol/format";
import { FeatureCollection } from "geojson";
import config from "react-global-configuration";
import { SupportedProjections } from "../core/types/projections";
import { WriteTransactionOptions } from "ol/format/WFS";
import Feature from "ol/Feature";

export enum TransactionMode {
  INSERT = "insert",
  UPDATE = "update",
  DELETE = "delete",
}

export class GeoserverUtil {
  private _workspace: string;
  private _layername: string;
  private _domain: string;
  private _srs: SupportedProjections;

  constructor(ws: string, layername: string) {
    this._layername = layername;
    this._domain = `${config.get("Geoserver")}${ws}`;
    this._workspace = ws;
    this._srs = SupportedProjections.ISRAEL;
  }
  get fType() {
    return `${this._workspace}:${this._layername}`;
  }
  public WFSTransaction = (mode: TransactionMode, featuresArray: Feature[]) => {
    const formatWFS = new WFS();
    const xs = new XMLSerializer();
    const options: WriteTransactionOptions = {
      featureNS: `${this._domain}`,
      featureType: this._layername,
      srsName: this._srs,
      featurePrefix: "",
      nativeElements: [],
    };
    let node;

    switch (mode) {
      case "insert":
        node = formatWFS.writeTransaction(featuresArray, [], [], options);
        break;
      case "update":
        node = formatWFS.writeTransaction([], featuresArray, [], options);
        break;
      case "delete":
        node = formatWFS.writeTransaction([], [], featuresArray, options);
        break;
      default:
        console.log(
          "passed transaction mode  did not match any of the supported transactions mode"
        );
        break;
    }
    if (node) {
      const wfsNode = xs.serializeToString(node);
      return axios.post(
        `${this._domain}/ows?service=WFS&typeName=${this.fType}`,
        wfsNode,
        {
          headers: { "Content-Type": "text/xml" },
        }
      );
    }
  };
  public getWFSFeatureById = async (FID: string) => {
    const map = API.map.getFocusedMap();
    const size = map.getSize();
    if (!size) {
      console.warn(
        "The provided map has no height attribute defined ! THe transaction will be sent with a 500 height parameter"
      );
    }
    const params = {
      service: "WFS",
      version: "1.3.0",
      request: "GetFeature",
      typeName: this.fType,
      outputFormat: "application/json",
      featureID: FID,
      height: size ? size[1] : 500,
    };
    const feature = await axios.get<FeatureCollection>(`${this._domain}/ows`, {
      params,
    });
    return feature.data.features[0];
  };

  public getWFSMetadata = async () => {
    const map = API.map.getFocusedMap();
    const size = map.getSize();
    if (!size) {
      console.warn(
        "The provided map has no height attribute defined ! THe transaction will be sent with a 500 height parameter"
      );
    }
    const params = {
      service: "WFS",
      version: "1.3.0",
      request: "DescribeFeatureType",
      typeName: `${this.fType}`,
      outputFormat: "application/json",
      height: size ? size[1] : 500,
    };
    const metadata = await axios.get(`${this._domain}/ows`, { params });
    return metadata.data;
  };

  public getAllFeatures = async () => {
    const params = {
      service: "WFS",
      version: "1.1.0",
      request: "GetFeature",
      typeName: this.fType,
      outputFormat: "application/json",
    };
    const feature = await axios.get<FeatureCollection>(`${this._domain}/wfs`, {
      params,
    });
    return feature.data.features.map((f) => {
      return { ...f.properties, geometry: f.geometry };
    });
  };
}
