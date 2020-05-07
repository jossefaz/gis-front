/* eslint-disable no-undef */

const NessSearching = (function () {
    var instance;

    function createInstance() {
        var object = {
            _searchProviders: {},
            _searchReady: true,

            addProvider(spConfig) {
                var sp = new SearchProvider(spConfig);
                this._searchProviders[sp.uuid.value] = sp;
                return sp.uuid.value;
            },

            killSearchProvider(uuid) {
                if (this._searchProviders.hasOwnProperty(uuid)) {
                    delete this._searchProviders[uuid];
                    return true;
                }

                return false;
            },

            InitSearch(query, timeoutMs = 1000) {
                if (this._searchReady) {
                    this._searchReady = false;

                    var qts = [];
                    var result = [];
                    for (k in this._searchProviders) {
                        qts.push(this._searchProviders[k].GenerateItems(query, result, timeoutMs));
                    }

                    var res = Promise.allSettled(qts);
                    
                    res.finally(() => {
                        this._searchReady = true;
                    });

                    return res;
                } else {
                    return null;
                }
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

export default NessSearching;