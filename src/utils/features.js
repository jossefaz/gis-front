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
  console.log(wfsNode);
  axios.post(
    "http://localhost:8080/geoserver/Jeru/ows?service=WFS&typeName=Jeru%3Adimigcompile",
    wfsNode,
    {
      headers: { "Content-Type": "text/xml" },
    }
  );
  // $.ajax('http://localhost:8080/geoserver/Jeru/ows?service=WFS&typeName=Jeru%3AGANANUTFORGEOSERVER', {
  //     type: 'POST',
  //     dataType: 'xml',
  //     processData: false,
  //     contentType: 'text/xml',
  //     data: wfsNode
  // }).done(function() {
  //   sourceWFS.clear();
  // });
};

export const updateSingleFeature = (feature) => {
  geoserverWFSTransaction(
    "http://localhost:8080/geoserver/Jeru",
    feature.type,
    "EPSG:2039",
    "update",
    [feature.ol_feature]
  );
  console.log(getFocusedMap().getLayers().getArray());
};

export const deleteSingleFeature = (feature) => {
  geoserverWFSTransaction(
    "http://localhost:8080/geoserver/Jeru",
    feature.type,
    "EPSG:2039",
    "delete",
    [feature.ol_feature]
  );

  // TODO : Use the Ness Mapping to access directly to the correct layer and perform a real refresh
  getFocusedMap()
    .getLayers()
    .getArray()
    .map((lyr) => {
      if (lyr instanceof ImageLayer) {
        const src = lyr.getSource().getParams().LAYERS;
        if (src && src.includes(feature.type)) {
          lyr.getSource().refresh();
          lyr.changed();
        }
      }
    });
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
