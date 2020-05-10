/* eslint-disable no-throw-literal */
import GenerateUUID from '../utils/uuid';
import SearchKeys from './keys';
import { promiseTimeout } from '../utils/promise-timeout';

export default class SearchProvider {

    constructor(spConfig) {
        var uuid = { value: GenerateUUID() };
        Object.freeze(uuid);  // freeze uuid, it is too important !
        this.uuid = uuid;

        this._config = spConfig;
    }

    _generateItems(query, intoArray) {
        return new Promise( (resolve, reject) => {
            switch (this._config.type) {
                case SearchKeys.SEARCH_TYPE_OBJ_ARRAY:
                    var res = this._config.data.filter(item => {
                        return item[this._config.field].indexOf(query)>=0;
                    }).map(item => {
                        // this returns an item
                        return {
                            item: item,
                            title: this._config.itemTitlePrefix + item[this._config.itemTitleField] + this._config.itemTitlePostfix,
                            invoker: (typeof this._config.invokerFunc === 'function' ? this._config.invokerFunc : this,this._defaultInvoker)
                        }
                    });

                    intoArray.push(...res);
                    resolve(true);
                    break;
                default:
                    reject('unhandled config type: ' + this._config.type);
            }
        });
    }

    _defaultInvoker(item) {
        console.log("  ..default invoker invoked on item " + JSON.stringify(item));
    }

    GenerateItems(query, intoArray, timeoutMs = 1000) {
        return promiseTimeout(this._generateItems(query, intoArray), timeoutMs);
    }
}