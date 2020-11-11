import { getFocusedMap } from "../nessMapping/api";
import axios from "axios";
import { WFS, GML } from "ol/format";

export const geoserverWFSTransaction = (
  domain,
  featureType,
  srs,
  mode,
  featuresArray
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
