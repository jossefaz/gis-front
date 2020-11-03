import { getFocusedMap, getCurrentExtent } from "../nessMapping/api";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { bbox } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";
import { WFS } from "ol/format";
export const getCurrentLayersSource = () => {
  const sources = [];
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof VectorLayer) {
        sources.push(lyr.getSource());
      }
    });
  return sources;
};

export const getFeaturesByExtent = (extent) => {
  const features = [];
  getCurrentLayersSource().map((vs) => {
    const editable = vs.get("editable");
    vs.forEachFeatureIntersectingExtent(extent, (feature) => {
      feature.set("editable", editable);
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
  featuresArray
) => {
  const formatWFS = new WFS();
  const xs = new XMLSerializer();
  const options = {
    featureNS: `${domain}/wfs`,
    featureType,
    srsName: srs,
  };
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

export const updateSingleFeature = async (feature) => {
  let success;
  await geoserverWFSTransaction(
    "http://localhost:8080/geoserver/Jeru",
    feature.type,
    "EPSG:2039",
    "update",
    [feature.ol_feature]
  )
    .then((res) => {
      // TODO : Use the Ness Mapping to access directly to the correct layer and perform a real refresh
      getFocusedMap()
        .getLayers()
        .getArray()
        .map((lyr) => {
          if (lyr instanceof ImageLayer) {
            const src = lyr.getSource().getParams().LAYERS;
            if (src && src.includes(feature.type)) {
              lyr.getSource().updateParams({ TIMESTAMP: Date.now() });
            }
          }
        });
      success = true;
    })
    .catch((err) => {
      console.log(err);
      success = false;
    });
  return success;
};

export const deleteSingleFeature = async (feature) => {
  let success;
  await geoserverWFSTransaction(
    "http://localhost:8080/geoserver/Jeru",
    feature.type,
    "EPSG:2039",
    "delete",
    [feature.ol_feature]
  )
    .then((res) => {
      // TODO : Use the Ness Mapping to access directly to the correct layer and perform a real refresh
      getFocusedMap()
        .getLayers()
        .getArray()
        .map((lyr) => {
          if (lyr instanceof ImageLayer) {
            const src = lyr.getSource().getParams().LAYERS;
            if (src && src.includes(feature.type)) {
              lyr.getSource().updateParams({ TIMESTAMP: Date.now() });
            }
          }
        });
      success = true;
    })
    .catch((err) => {
      console.log(err);
      success = false;
    });
  return success;
};

export const newVectorSource = (url, srs, layernames, editable, formatWFS) => {
  const params = {
    service: "WMS",
    version: "1.1.0",
    request: "GetMap",
    bbox: getCurrentExtent().join(","),
    srs: srs,
    format: "geojson",
    width: getFocusedMap().getSize()[0],
    height: getFocusedMap().getSize()[1],
  };

  if (layernames) {
    params.layers = layernames;
  }

  const vectorSource = new VectorSource({
    loader: () => {
      axios.get(url, { params }).then((res) => {
        const format = formatWFS ? formatWFS : vectorSource.getFormat();
        vectorSource.addFeatures(format.readFeatures(res.data));
      });
    },
    format: new GeoJSON({
      dataProjection: projIsrael,
    }),
    strategy: bbox,
  });
  if (editable) {
    vectorSource.set("editable", true);
  }

  return vectorSource;
};

export const getWFSFeatureById = async (layername, FID) => {
  //http://localhost:8080/geoserver/Jeru/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Jeru%3Adimigcompile&maxFeatures=50&outputFormat=application%2Fjson&featureID=dimigcompile.16

  const params = {
    service: "WFS",
    version: "1.0.0",
    request: "GetFeature",
    typeName: layername,
    outputFormat: "application/json",
    featureID: FID,
    height: getFocusedMap().getSize()[1],
  };

  const feature = await axios.get("http://localhost:8080/geoserver/Jeru/ows", {
    params,
  });

  return feature.data.features[0].geometry;
};
