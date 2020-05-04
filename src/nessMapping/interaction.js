/* eslint-disable no-undef */
import InteractionProxy from "./InteractionProxy";
import NessKeys from './keys'

const NessMapping = (function () {
    var instance;

    function createInstance() {
        var object = {
            _InteractionProxies: {},

            getInteractionProxy(uuid) {
                return this._InteractionProxies[uuid];
            },


            addInteractionProxy(config) {
                const ip = new InteractionProxy(config);
                this._InteractionProxies[ip.uuid.value] = ip;
                return ip;
            },

            killInteractionProxy(uuid) {
                if (this._InteractionProxies.hasOwnProperty(uuid)) {
                    delete this._InteractionProxies[uuid];
                    return true;
                }

                return false;
            }
        };
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

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

export default NessMapping;