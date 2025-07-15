import { createStore, hasSubscribers, subscribeToStore } from "./StoreUtils.js";
import { addLoadFunction } from "./InitStoreManager.js";
import type { BaseThunk } from "../update/BaseThunk.ts";
import type {
  ComponentLoadConfig,
  RequestStoreItem,
} from "../../components/types/ComponentLoadConfig.ts";
import type {BaseThunkAction} from "../update/BaseThunkAction.ts";

const stores: Record<string, any> = {};
const responseCache: Record<string, any> = {};
const requestsWithoutCache = new Set<string>();

export function createRequestStoreWithData(
  storeName: string,
  dataSource: BaseThunk,
  initStore: () => any = () => {
    return { load: true };
  },
) {
  createStore(storeName, stores);
  responseCache[storeName] = {};

  subscribeToRequestStore(storeName, dataSource);
  updateRequestStore(storeName, initStore, null);
}

export function subscribeToRequestStore(storeName: string, item: any) {
  subscribeToStore(storeName, item, stores);
  if (!responseCache[storeName]) {
    responseCache[storeName] = {};
  }
}

export function hasRequestStore(storeName: string): boolean {
  return storeName in stores;
}

export function updateRequestStoreAndClearCache(
  storeName: string,
  params: Record<string, string>,
) {
  responseCache[storeName] = {};
  updateRequestStore(
    storeName,
    () => {
      return params;
    },
    null,
  );
}

/**
 * Updates the request store for an API call. This should only be called upon a component's initial render or when
 *  a user action requires a request store
 * @param storeName
 * @param updateFunction
 * @param data
 */
export function updateRequestStore(
  storeName: string,
  updateFunction: (a?: any) => any,
  data?: any,
) {
  if (!(storeName in stores)) {
    createStore(storeName, stores);
  }

  if (!data) {
    data = stores[storeName].data;
  }

  stores[storeName].data = {
    ...updateFunction(data),
  };

  stores[storeName].subscribers.forEach(function (item: any) {
    const requestData = stores[storeName].data;

    if (!item.dispatchers || item.dispatchers.length === 0) {
      throw new Error(
        `No dispatchers for the response associated with: ${storeName} Make sure a component is subscribed to the store thunk`,
      );
    }

    //TODO: If a response would invalidate a cache item, do a page refresh or clear the whole cache.
    if (
      requestData &&
      Object.keys(requestData).length > 0 &&
      JSON.stringify(requestData) in responseCache[storeName]
    ) {
      item.updateStore(responseCache[storeName][JSON.stringify(requestData)]);
    } else {
      item.retrieveData(requestData).then((response: any) => {
        if (!requestsWithoutCache.has(storeName)) {
          responseCache[storeName][JSON.stringify(requestData)] = response;
        }
        item.updateStore(response);
      });
    }
  });
}

export function hasRequestStoreSubscribers(storeName: string): boolean {
  return hasSubscribers(storeName, stores);
}

export function createRequestStore(storeName:string, dataSource: BaseThunkAction){
  createStore(storeName, stores);
  responseCache[storeName] = {};
  subscribeToRequestStore(
    storeName,
    dataSource,
  );
}

export function initRequestStore(config: ComponentLoadConfig) {
  function getRequestData() {
    return config.onLoadRequestData;
  }

  const onLoadConfig = config.onLoadStoreConfig;
  if (!onLoadConfig) {
    return;
  }

  const storeName = onLoadConfig.storeName ? onLoadConfig.storeName : onLoadConfig.dataSource.getRequestStoreId();
  if(!storeName){
    throw new Error("Store name not defined");
  }

  if (onLoadConfig.disableCache) {
    requestsWithoutCache.add(storeName);
  }
  createRequestStoreWithData(
    storeName,
    onLoadConfig.dataSource,
    getRequestData,
  );

  if (config.requestStoresToCreate) {
    config.requestStoresToCreate.forEach(function (
      requestStoreItem: RequestStoreItem,
    ) {
      createStore(storeName, stores);
      responseCache[storeName] = {};
      subscribeToRequestStore(
        storeName,
        requestStoreItem.dataSource,
      );
    });
  }

  if (config.onLoadRequestConfig) {
    config.onLoadRequestConfig.forEach(function (
      requestStoreItem: RequestStoreItem,
    ) {
      createRequestStoreWithData(
        storeName,
        requestStoreItem.dataSource,
      );
    });
  }
}

export function initRequestStoresOnLoad(config: ComponentLoadConfig) {
  const onLoadConfig = config.onLoadStoreConfig;
  if (!onLoadConfig) {
    return;
  }

  const storeName = onLoadConfig.storeName ? onLoadConfig.storeName : onLoadConfig.dataSource.getRequestStoreId();
  if(!storeName){
    throw new Error("Store name not defined");
  }
  addLoadFunction(storeName, function () {
    initRequestStore(config);
  });
}
