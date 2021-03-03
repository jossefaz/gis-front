/* eslint-disable no-undef */
import InteractionProxy from "../proxy/interaction";
import { InteractionOptions } from "../types/interaction";
class InteractionProxyManager {
  private static instance: InteractionProxyManager;
  private _interactionsProxies: { [uuid: string]: InteractionProxy };

  private constructor() {
    this._interactionsProxies = {};
  }

  public static getInstance(): InteractionProxyManager {
    if (!InteractionProxyManager.instance) {
      InteractionProxyManager.instance = new InteractionProxyManager();
    }

    return InteractionProxyManager.instance;
  }

  public getProxy(uuid: string): InteractionProxy | null {
    return uuid in this._interactionsProxies
      ? this._interactionsProxies[uuid]
      : null;
  }

  public addProxy(config: InteractionOptions): string {
    const proxy = new InteractionProxy(config);
    this._interactionsProxies[proxy.uuid.value] = proxy;
    return proxy.uuid.value;
  }

  public killMapProxy(uuid: string): boolean {
    if (this._interactionsProxies.hasOwnProperty(uuid)) {
      delete this._interactionsProxies[uuid];
      return true;
    }
    return false;
  }
}

export default InteractionProxyManager;
