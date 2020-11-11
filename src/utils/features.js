import { getFocusedMap, getCurrentExtent } from "../nessMapping/api";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../nessMapping/mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";
import { WFS, GML } from "ol/format";
import VectorLayerRegistry from "./vectolayers";
export const getCurrentLayersSource = () => {
  const sources = [];
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (
        lyr instanceof VectorLayer &&
        lyr.get("__NessUUID__") !== "drawlayer"
      ) {
        sources.push(lyr.getSource());
      }
    });
  return sources;
};

export const getFeaturesByExtent = (extent) => {
  const features = [];
  getCurrentLayersSource().map((vs) => {
    // const editable = vs.get("editable"); //TODO : uncomment and change for real editable
    vs.forEachFeatureIntersectingExtent(extent, (feature) => {
      feature.set("editable", true); // TODO : change true value by real editable value
      feature.set("__NessUUID__", vs.get("__NessUUID__"));
      features.push(feature);
    });
  });
  return features;
};

export const geoserverWFSTransaction = (
  domain,
  featureType,
  srs,
  mode,
  featuresArray,
  onlyAlphanum
) => {
  const formatWFS = new WFS();
  const xs = new XMLSerializer();
  const options = new GML({
    featureNS: `${domain}`,
    featureType,
    srsName: srs,
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
    `${domain}/ows?service=WFS&typeName=Jeru:${featureType}`,
    wfsNode,
    {
      headers: { "Content-Type": "text/xml" },
    }
  );
};

export const getVectorLayersByRefName = (__NessUUID__) => {
  const registry = VectorLayerRegistry.getInstance();
  return registry.getVectorLayer(__NessUUID__).vl;
};

export const initVectorLayers = (arrayOfLayerNames) => {
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      const registry = VectorLayerRegistry.getInstance();
      const exists = Boolean(registry.getVectorLayer(lyr.get("__NessUUID__")));
      if (
        lyr instanceof ImageLayer &&
        arrayOfLayerNames.includes(lyr.get("__NessUUID__")) &&
        !exists
      ) {
        registry.setFromImageLayer(lyr);
      }
    });
};

export const getWFSFeatureById = async (layername, FID) => {
  const params = {
    service: "WFS",
    version: "1.3.0",
    request: "GetFeature",
    typeName: layername,
    outputFormat: "application/json",
    featureID: FID,
    height: getFocusedMap().getSize()[1],
  };

  const feature = await axios.get("http://localhost:8080/geoserver/Jeru/ows", {
    params,
  });

  return feature.data.features[0];
};

export const getWFSMetadata = async (layername) => {
  const params = {
    service: "WFS",
    version: "1.3.0",
    request: "DescribeFeatureType",
    typeName: layername,
    outputFormat: "application/json",
    height: getFocusedMap().getSize()[1],
  };

  const metadata = await axios.get("http://localhost:8080/geoserver/Jeru/ows", {
    params,
  });

  return metadata.data;
};

export const getFeatureFromNamedLayer = (__NessUUID__, fid) => {
  let feature = null;
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof VectorLayer) {
        const src = lyr.get("__NessUUID__");
        if (src && src.includes(__NessUUID__)) {
          feature = lyr.getSource().getFeatureById(fid);
        }
      }
    });
  if (feature) {
    return feature;
  }
  return false;
};

export const zoomToFeature = (feature) => {
  const extent = feature.getGeometry().getExtent();
  getFocusedMap()
    .getView()
    .fit(extent, { padding: [850, 850, 850, 850] });
};
