import MapProxy from "./mapProxy";

export default NessMapping = (function () {
    var instance;
 
    function createInstance() {
        var object = {
            maps: {},
            addMap: function (mapConfig) {
                var mp = new MapProxy(mapConfig);
                this.maps[mp.uuid] = mp;
                return mp;
            },
    
            killMap(uuid) {
                if (this.maps[uuid]) {
                    delete this.maps[uuid];
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