import { getFocusedMap } from "../nessMapping/api";
import axios from "axios";
import { WFS, GML } from "ol/format";
import config from "react-global-configuration";

export class GeoserverUtil {
  constructor(ws, layername) {
    this.layername = layername;
    this.domain = `${config.get("Geoserver")}${ws}`;
    this.workspace = ws;
    this.srs = "EPSG:2039";
  }
  get fType() {
    return `${this.workspace}:${this.layername}`;
  }
  WFSTransaction = (mode, featuresArray) => {
    const formatWFS = new WFS();
    const xs = new XMLSerializer();
    const options = new GML({
      featureNS: `${this.domain}`,
      featureType: this.layername,
      srsName: this.srs,
    });
    let node;

    switch (mode) {
      case "insert":
        node = formatWFS.writeTransaction(featuresArray, null, null, options);
        break;
      case "update":
        node = formatWFS.writeTransaction(null, featuresArray, null, options);
        break;
      case "delete":
        node = formatWFS.writeTransaction(null, null, featuresArray, options);
        break;
      default:
        return;
    }
    const wfsNode = xs.serializeToString(node);

    return axios.post(
      `${this.domain}/ows?service=WFS&typeName=${this.fType}`,
      wfsNode,
      {
        headers: { "Content-Type": "text/xml" },
      }
    );
  };
  getWFSFeatureById = async (FID) => {
    const params = {
      service: "WFS",
      version: "1.3.0",
      request: "GetFeature",
      typeName: this.fType,
      outputFormat: "application/json",
      featureID: FID,
      height: getFocusedMap().getSize()[1],
    };
    const feature = await axios.get(`${this.domain}/ows`, { params });
    return feature.data.features[0];
  };

  getWFSMetadata = async () => {
    const params = {
      service: "WFS",
      version: "1.3.0",
      request: "DescribeFeatureType",
      typeName: `${this.fType}`,
      outputFormat: "application/json",
      height: getFocusedMap().getSize()[1],
    };
    const metadata = await axios.get(`${this.domain}/ows`, { params });
    return metadata.data;
  };

  getAllFeatures = async () => {
    const params = {
      service: "WFS",
      version: "1.1.0",
      request: "GetFeature",
      typeName: this.fType,
      outputFormat: "application/json",
    };
    const feature = await axios.get(`${this.domain}/wfs`, { params });
    return feature.data.features.map((f) => {
      return { ...f.properties, geometry: f.geometry };
    });
  };
}
