/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
import GenerateUUID from '../utils/uuid';
import MapProxy from './mapProxy';
import NessMapping from './mapping'
import NessKeys from './keys'
import { newDraw } from '../utils/func'
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
    AddSelfToMap(parent) {
        var okToAdd = false;
        if (!this.parent && parent instanceof MapProxy && parent.OLMap) {
            this.parent = parent;
            okToAdd = true;
        }

        if (okToAdd) {
            var olInteraction = _toOLInteraction(this);

            if (olInteraction) {
                // add the layer to the map
                this.parent.OLMap.addInteraction(olInteraction);

                // OK, layer is in! set uuid 
                olInteraction.set(NessKeys.NESS_INTERACTION_UUID_KEY, this.uuid.value, true);

                // and now refresh mapIndex
                this.RefreshMapIndex();

                // TODO: register to removeInteraction event on map

                return this.uuid.value;
            } else {
                throw "AddInteraction failed - Interaction not created correctly"
            }
        }
    }

}

////////////////////////////////////////////////////////
// "privates"
////////////////////////////////////////////////////////
const _toOLInteraction = (ni) => {
    // TODO: init a propper OpenLayers Layer object and return it
    var newInteraction = null;
    switch (ni.config.Type) {
        case "Draw":
            newInteraction = newDraw(ni.config.drawConfig.type)
            break;
    }
    if (!newInteraction) {
        throw "Failed creating OL Interaction";
    }
    return newInteraction;
}

const _getMapIndex = (ni) => {
    if (ni instanceof NessInteraction && ni.uuid && ni.parent && ni.parent.OLMap) {
        const interactions = ni.parent.OLMap.getInteractions().getArray();
        return interactions.find(overlay => overlay.get(NessKeys.NESS_INTERACTION_UUID_KEY) === ni.uuid.value)
    }
    return -1;
}

export const getInteractionObject = (uuid, OLMap) => {
    if (uuid) {
        const interactions = OLMap.getInteractions().getArray();
        return interactions.find(interaction => interaction.get(NessKeys.NESS_INTERACTION_UUID_KEY) === uuid)
    }
    return -1;
}

export const deleteInteractionObject = (interaction, OLMap) => {
    try {
        OLMap.removeInteraction(interaction)
        return true
    } catch (error) {
        return -1;

    }
}