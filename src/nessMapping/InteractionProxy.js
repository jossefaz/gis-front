/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import GenerateUUID from '../utils/uuid';
import MapProxy from './mapProxy';
import NessKeys from './keys'
import { newDraw, newDragBox, newSelect, newModify } from '../utils/interactions'
export default class NessInteraction {
    constructor(config) {
        this.uuid = { value: GenerateUUID() };
        Object.freeze(this.uuid);
        this.mapIndex = -1;
        this.parent = null;
        this.config = config;
    }
    RefreshMapIndex() {
        this.mapIndex = -1;
        if (this.parent && this.parent.OLMap && this.uuid) {
            this.mapIndex = _getMapIndex(this);
        }
        return this.mapIndex;
    }
    get OLInteraction() {
        return this._olInteraction;
    }
    AddSelfToMap(parent) {
        var okToAdd = false;
        if (!this.parent && parent instanceof MapProxy && parent.OLMap) {
            this.parent = parent;
            okToAdd = true;
        }

        if (okToAdd) {
            const { olInteraction, sourceLayer, vLayer } = _toOLInteraction(this);

            if (olInteraction) {
                // add the layer to the map
                this.parent.OLMap.addInteraction(olInteraction);

                olInteraction.set(NessKeys.NESS_INTERACTION_UUID_KEY, this.uuid.value, true);
                olInteraction.set(NessKeys.PARENT_UUID, this.parent.uuid.value, true);
                if (sourceLayer) {
                    olInteraction.set(NessKeys.VECTOR_SOURCE, this.parent.setVectorSource(sourceLayer), true);
                }
                if (vLayer) {
                    olInteraction.set(NessKeys.GRAPHIC_LAYER, this.parent.setGraphicLayer(vLayer), true);
                }



                this._olInteraction = olInteraction
                // and now refresh mapIndex
                this.RefreshMapIndex();
                // TODO: register to removeInteraction event on map
                return this.uuid.value;
            } else {
                throw "AddInteraction failed - Interaction not created correctly"
            }
        }
    }
    RemoveSelfFromMap() {
        this.parent.OLMap.removeInteraction(this._olInteraction);
    }

}

////////////////////////////////////////////////////////
// "privates"
////////////////////////////////////////////////////////
const _toOLInteraction = (ni) => {
    // TODO: init a propper OpenLayers Layer object and return it
    let olInteraction, sourceLayer, vLayer = null;
    let interactionConfig = ni.config.interactionConfig ? ni.config.interactionConfig : null
    switch (ni.config.Type) {
        case "Draw":
            const { Interaction, vectorSource, Layer } = newDraw(ni.config.drawConfig.type, ni.config.sourceLayer, ni.config.Layer)
            olInteraction = Interaction
            sourceLayer = vectorSource
            vLayer = Layer
            break;

        case "Select":
            olInteraction = newSelect(interactionConfig);
            break;
        case "DragBox":
            olInteraction = newDragBox(interactionConfig);
            break;
        case "Modify":
            olInteraction = newModify(interactionConfig)
            break;
    }
    if (!olInteraction) {
        throw "Failed creating OL Interaction";
    }
    return { olInteraction, sourceLayer, vLayer };
}

const _getMapIndex = (ni) => {
    if (ni instanceof NessInteraction && ni.uuid && ni.parent && ni.parent.OLMap) {
        const interactions = ni.parent.OLMap.getInteractions().getArray();
        return interactions.find(overlay => overlay.get(NessKeys.NESS_INTERACTION_UUID_KEY) === ni.uuid.value)
    }
    return -1;
}

