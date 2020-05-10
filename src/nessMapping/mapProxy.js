/* eslint-disable no-throw-literal */
import GenerateUUID from '../utils/uuid';
import NessLayer from "./nessLayer";
import Nesskeys from "./keys"
import {
    Map
} from "ol";

export default class MapProxy {
    constructor(mapConfig) {
        var uuid = {
            value: GenerateUUID()
        };
        Object.freeze(uuid); // freeze uuid, it is too important !

        this.uuid = uuid;

        this._layers = [];

        this._graphicLayers = {};
        this._vectorSource = {};

        mapConfig.layers = []; // ensure we begin with an empty layers array
        this._olmap = new Map(mapConfig);
    }

    // TODO: consider hiding map completely...
    get OLMap() {
        return this._olmap;
    }

    getGraphicLayer(ol_id) {
        return this._graphicLayers[ol_id]
    }

    getVectorSource(ol_id) {
        return this._vectorSource[ol_id]
    }

    setGraphicLayer(ol_layer, source_uid = null) {
        if (source_uid) {
            ol_layer.set(Nesskeys.VECTOR_SOURCE, source_uid)
        }
        this._graphicLayers[ol_layer.ol_uid] = ol_layer
        return ol_layer.ol_uid
    }

    setVectorSource(ol_vectorSource) {
        this._vectorSource[ol_vectorSource.ol_uid] = ol_vectorSource
        return ol_vectorSource.ol_uid
    }





    AddLayer(lyrOrId, addToMap = false) {
        var nl = null;

        if (typeof lyrOrId === 'number') {
            // this might be a metadata layer id
            nl = new NessLayer(lyrOrId);
        } else if (lyrOrId instanceof NessLayer) {
            nl = lyrOrId;
        } else {
            throw "AddLayer failed - invalid input";
        }

        this._layers.push(nl);
        if (addToMap) {
            nl.AddSelfToMap(this);
        }

        return nl;
    }
}