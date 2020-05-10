/* eslint-disable no-undef */
import OverlayProxy from "./OverlayProxy";

const NessMapping = (function () {
    var instance;

    function createInstance() {
        var object = {
            _OverlayProxies: {},

            getOverlayProxy(uuid) {
                return this._OverlayProxies[uuid];
            },


            addOverlayProxy(config) {
                const ip = new OverlayProxy(config);
                this._OverlayProxies[ip.uuid.value] = ip;
                return ip;
            },

            killOverlayProxy(uuid) {
                if (this._OverlayProxies.hasOwnProperty(uuid)) {
                    delete this._OverlayProxies[uuid];
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