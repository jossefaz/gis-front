import { TIMEOUT } from "dns";
import { result } from "lodash";

export default (function () {
  let instance;
  function createInstance() {
    class Providers {
      registry = {};

      TIME_OUT = "30";

      register = (
        providerFunction,
        providerCategory,
        subscriberFunction,
        selectedEventCallBack
      ) => {
        this.registry[providerCategory] = {
          provide: providerFunction,
          subscribe: subscriberFunction,
          category: providerCategory,
          cb: selectedEventCallBack,
        };
      };

      unRegister = (providerCategory) => {
        if (providerCategory in this.registry) {
          delete this.registry[providerCategory];
        }
      };

      search = async (what) => {
        Object.values(this.registry).map((pub_sub) => {
          new Promise((resolve, reject) => {
            pub_sub.provide(what, (error, result) => {
              if (error) {
                return reject(error);
              }
              return resolve(result);
            });
          }).then((res) => {
            //Add the call back to each item
            res = res.map((item) => {
              return { ...item, cb: pub_sub.cb };
            });
            pub_sub.subscribe(res, pub_sub.category);
          });
        });
      };
    }
    const el = new Providers();
    return el;
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
