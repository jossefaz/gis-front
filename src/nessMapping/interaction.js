/* eslint-disable no-undef */
import InteractionProxy from "./InteractionProxy";

export default (function () {
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
      },
    };
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();
