/* eslint-disable no-undef */
import MapProxy from "./mapProxy";

const NessMapping = (function () {
    var instance;

    function createInstance() {
        var object = {
            _mapProxies: {},

            getMapProxy(uuid) {
                return this._mapProxies[uuid];
            },

            addMapProxy(mapConfig) {
                var mp = new MapProxy(mapConfig);
                console.log(mp._olmap)
                console.log(mp.uuid.value)
                this._mapProxies[mp.uuid.value] = mp;
                return mp.uuid.value;
            },

            killMapProxy(uuid) {
                if (this._mapProxies.hasOwnProperty(uuid)) {
                    delete this._mapProxies[uuid];
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

export default NessMapping;