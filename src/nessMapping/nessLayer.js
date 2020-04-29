/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import GenerateUUID from '../utils/uuid';
import MapProxy from './mapProxy';

import {Tile as TileLayer, Image as ImageLayer} from 'ol/layer';
import {OSM, ImageArcGISRest} from 'ol/source';

import { MDUtils as md } from '../utils/metadataUtils';
import { LYRUtils as lu } from '../utils/layerUtils';

export const NESS_LAYER_UUID_KEY = "__NessUUID__";

export default class NessLayer {
    constructor (mdId, alias, lyr) {
        this.uuid = null;
        this.mapIndex = -1;
        this.parent = null;

        var nl = md.getMDLayerById(mdId) || lu.getMDLayerByObject(lyr);
        if (nl) {
            // must-have props
            this.uuid = GenerateUUID();
            this.metadataId = nl.metadataId;

            // must-have layer configuration props
            this.config = nl.config;
            
            // LayerList props
            this.alias = alias || nl.alias;
        } else {
            throw "NessLayer constructor failed";
        }
    }

    RefreshMapIndex() {
        this.mapIndex = -1;

        if (this.parent && this.parent.OLMap && this.uuid) {
            this.mapIndex = _getMapIndex(this);
        }

        return this.mapIndex;
    }

    AddSelfToMap(parent) {
        var okToAdd = false;
        if (this.parent && this.parent.OLMap) {
            // we already have an existing parent. check sanity
            this.RefreshMapIndex();
            if (this.mapIndex < 0) {
                okToAdd = true;
            } else {
                throw "layer already exists in map";
            }
        } else if (parent instanceof MapProxy && parent.OLMap) {
            // no parent, set parent and add
            this.parent = parent;
            okToAdd = true;
        }

        if (okToAdd) {
            var olLayer = _toOLLayer(this);

            if (olLayer) {
                // add the layer to the map
                this.parent.OLMap.addLayer(olLayer);

                // OK, layer is in! set uuid 
                olLayer.set(NESS_LAYER_UUID_KEY, this.uuid, true);

                // and now refresh mapIndex
                this.RefreshMapIndex();

                // TODO: register to removeLayer event on map (just in case...)

                return true;
            } else {
                throw "AddLayer failed - layer not created correctly"
            }
        }
    }
}

////////////////////////////////////////////////////////
// "privates"
////////////////////////////////////////////////////////
const _toOLLayer = (nl) => {
    // TODO: init a propper OpenLayers Layer object and return it

    var newLyr = null;
    var newSrc = null;

    switch (nl.config.SourceType) {
        case "OL_ImageArcGISRest":
            newSrc = new ImageArcGISRest(nl.config.SourceOptions);
            break;
    }

    switch (nl.config.LayerType) {
        case "OL_TileLayer":
            break;
        case "OL_ImageLayer":
            newLyr = new ImageLayer({
                source: newSrc
            });
            break;
        case "OL_VectorLayer":
            break;
        case "OL_Heatmap":
            break;
        case "OL_Graticule":
            break;
        case "OL_VectorTileLayer":
            break;
        case "OL_VectorImageLayer":
            break;
    }

    if (!newLyr){
        throw "Failed creating OL layer";
    }

    return newLyr;
}

const _getMapIndex = (nl) => {
    if (nl instanceof NessLayer && nl.uuid && nl.parent && nl.parent.OLMap) {
        for (var i=0; i<nl.parent.OLMap.layers.length; i++) {
            if (nl.parent.OLMap.layers[i].get(NESS_LAYER_UUID_KEY) === nl.uuid) {
                return i;
            }
        }    
    }

    return -1;
}