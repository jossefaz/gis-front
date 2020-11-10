import { getFocusedMap, getCurrentExtent } from "../nessMapping/api";
import { Image as ImageLayer, Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../nessMapping/mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "./projections";
import axios from "axios";
import { WFS, GML } from "ol/format";
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
    const editable = vs.get("editable");
    vs.forEachFeatureIntersectingExtent(extent, (feature) => {
      feature.set("editable", editable);
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
  // if (onlyAlphanum) {
  //   featuresArray.map((f) => f.unset("geometry"));
  // }
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

export const getVectorLayersByRefName = (__NessUUID__) => {
  let found = false;
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (
        lyr instanceof VectorLayer &&
        lyr.get("__NessUUID__") == __NessUUID__
      ) {
        found = lyr;
      }
    });
  return found;
};

export const initVectorLayers = (arrayOfLayerNames) => {
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      console.log(lyr);
      const exists = Boolean(getVectorLayersByRefName(lyr.get("__NessUUID__")));
      if (
        lyr instanceof ImageLayer &&
        arrayOfLayerNames.includes(lyr.get("__NessUUID__")) &&
        !exists
      ) {
        debugger;
        const source = lyr.getSource();
        const vectorSource = newVectorSource(
          `${source.getUrl()}/wfs`,
          "EPSG:2039",
          source.getParams().LAYERS,
          lyr.get("editable"),
          null
        );
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });
        vectorLayer.set("__NessUUID__", lyr.get("__NessUUID__"));
        vectorSource.set("__NessUUID__", lyr.get("__NessUUID__"));
        vectorLayer.set("editable", true); //TODO : change this to real editable check

        getFocusedMap().addLayer(vectorLayer);
        vectorLayer.setStyle(styles.HIDDEN);
      }
    });
};

export const newVectorSource = (url, srs, layername, editable, formatWFS) => {
  const params = {
    service: "WFS",
    version: "1.3.0",
    request: "GetFeature",
    typeName: layername,
    srsname: srs,
    outputFormat: "application/json",
    height: getFocusedMap().getSize()[1],
  };

  if (layername) {
    params.layers = layername;
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
    strategy: bboxStrategy,
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
