import API from "../api";
import { Vector as VectorLayer, Image as ImageLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import styles from "../mapStyle";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { GeoserverUtil } from "../../utils/Geoserver";
import GeoJSON from "ol/format/GeoJSON";
import { projIsrael } from "../../utils/projections";
import { Style } from "ol/style";
import ImageWMS from "ol/source/ImageWMS";
import axios from "axios";
import { Extent } from "ol/extent";
import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import { FeatureCollection } from "geojson";

export default class VectorLayerProxy {
  public uuid: string | undefined;
  private _vl: VectorLayer | undefined;
  private _source: VectorSource | undefined;
  private _data: any[];
  private _sourceUrl: string | undefined;
  private _layername: string | undefined;
  private _editable: boolean | undefined;
  private _geoserverUtil: GeoserverUtil | undefined;

  constructor(vl?: VectorLayer) {
    this._vl = vl;
    if (this._vl instanceof VectorLayer) {
      this.uuid = this._vl.get("__NessUUID__");
      this._vl.getSource()
        ? (this._source = this._vl.getSource())
        : (this._source = new VectorSource());
    }
    this._data = [];
  }

  public get vectorLayer(): VectorLayer | null {
    return this._vl ? this._vl : null;
  }

  public fromImageLayer = (il: ImageLayer) => {
    const source = il.getSource() as ImageWMS;
    this.uuid = il.get("__NessUUID__");
    this._sourceUrl = source.getUrl();
    this._layername = source.getParams().LAYERS;
    this._editable = il.get("editable") as boolean;
    if (this._layername) {
      this._geoserverUtil = new GeoserverUtil(
        this._layername.split(":")[0],
        this._layername.split(":")[1]
      );
    }
    this._initVectorLayer();
    this._addToMap();
    this._initVectorSource();
  };

  get source() {
    return this._source ? this._source : null;
  }

  public getAttributes = async () => {
    if (this._isValid() && this._geoserverUtil) {
      return await this._geoserverUtil.getWFSMetadata();
    }
  };

  private _isValid = () => {
    return this._layername && this.uuid && this._vl;
  };

  private _addToMap = () => {
    // TODO : check needs for doing this through proxy
    this._vl && API.map.getFocusedMap().addLayer(this._vl);
  };

  private _initVectorLayer = () => {
    this._vl = new VectorLayer();
    this._vl.set("__NessUUID__", this.uuid);
    this._vl.set("editable", true); //TODO : change this to real editable check
    this._vl.setStyle(styles.HIDDEN);
    this._vl.setZIndex(99);
  };

  private _initVectorSource = () => {
    this._newVectorSource();
    if (this._source && this._vl) {
      this._source.set("editable", this._editable);
      this._source.set("__NessUUID__", this.uuid);
      this._source.forEachFeature((feature) => feature.setStyle(styles.HIDDEN));
      this._vl.setSource(this._source);
    }
  };

  private _toggleVisibility = () => {
    this._vl && this._vl.setVisible(!this._vl.getVisible());
  };

  private _setStyle = (style: Style) => {
    this._vl && this._vl.setStyle(style);
  };

  public getFeaturesByExtent = (extent: Extent) => {
    const features: Feature[] = [];
    if (this._source) {
      this._source.forEachFeatureIntersectingExtent(extent, (feature) => {
        if (this._source) {
          feature.set("editable", true); // TODO : change true value by real editable value
          feature.set("__NessUUID__", this._source.get("__NessUUID__"));
          features.push(feature);
        }
      });
    }
    return features;
  };

  public getFeaturesAtCoordinate = (coordinates: Coordinate) => {
    let features: Feature[] = [];
    if (this._source) {
      features = this._source.getFeaturesAtCoordinate(coordinates);
      features.forEach((feature) => {
        if (this._source) {
          feature.set("editable", true); // TODO : change true value by real editable value
          feature.set("__NessUUID__", this._source.get("__NessUUID__"));
        }
      });
    }
    return features;
  };

  public refresh = () => {
    this._source && this._source.refresh();
  };

  public clear = () => {
    this._source && this._source.clear();
  };

  public getFeaturesData = () => {
    return new Promise((resolve, reject) => {
      if (this._data.length > 0) {
        resolve(this._data);
      } else {
        if (this._source) {
          this._source.on("change", (evt) => {
            const source = evt.target;
            if (source.getState() === "ready" && this._vl) {
              const features = this._vl.getSource().getFeatures();
              this._data = features.map((feature) => feature.getProperties());
              resolve(this._data);
            }
          });
        }
      }
    });
  };

  public highlightFeature = (eFeature: Feature): void => {
    this._source &&
      this._source.forEachFeature((feature) => {
        if (feature.getId() === eFeature.getId()) {
          feature.setStyle(styles.EDIT);
        } else {
          feature.setStyle(styles.HIDDEN);
        }
      });
  };

  public hideAllFeatures = () => {
    this._source &&
      this._source.forEachFeature((feature) => {
        feature.setStyle(styles.HIDDEN);
      });
  };

  public highlightAllFeatures = () => {
    this._source &&
      this._source.forEachFeature((feature) => {
        feature.setStyle(styles.EDIT);
      });
  };

  public getFeatureById = (id: string | number) => {
    return this._source && this._source.getFeatureById(id);
  };

  private _newVectorSource = () => {
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
      typeName: this._layername,
      layers: this._layername,
      srsname: "EPSG:2039",
      outputFormat: "application/json",
      height: size ? size[1] : 500,
    };
    this._source = new VectorSource({
      loader: () => {
        axios
          .get<FeatureCollection>(`${this._sourceUrl}/wfs`, { params })
          .then((res) => {
            if (this._source) {
              const format = this._source.getFormat();
              if (format) {
                const featurelike = format.readFeatures(res.data) as Feature[];
                this._source.addFeatures(featurelike);
              }
            }
          });
      },
      format: new GeoJSON({
        dataProjection: projIsrael,
      }),
      strategy: bboxStrategy,
    });
  };
}
