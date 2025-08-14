import { createStore, subscribeToStore } from "./StoreUtils.js";
import type { BaseThunk } from "../update/BaseThunk.ts";
import {createResponseCacheIfNotExists} from "./SessionStorageUtils.ts";

let stores: Record<string, RequestStoreData> = {};
const requestsWithoutCache = new Set<string>();

type RequestStoreData = {
  data:any,
  subscribers: BaseThunk[]
}

export function createRequestStoreWithData(
  storeName: string,
  dataSource: BaseThunk,
  initStore: () => any = () => {
    return { load: true };
  },
) {
  createStore(storeName, stores);

  createResponseCacheIfNotExists(storeName);

  subscribeToRequestStore(storeName, dataSource);
  updateRequestStore(storeName, initStore, null);
}

export function subscribeToRequestStore(storeName: string, item: any) {
  if(!item.dispatchers){
    throw Error(`Invalid subscription to ${storeName}. Dispatchers must be defined`)
  }
  subscribeToStore(storeName, item, stores);
}

export function hasRequestStore(storeName: string): boolean {
  return storeName in stores;
}

export function updateRequestStoreAndClearCache(
  storeName: string,
  params: Record<string, string>,
) {
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

  stores[storeName].subscribers.forEach( (item: BaseThunk) => {
    const requestData = stores[storeName].data;
    const cacheKey = requestsWithoutCache.has(storeName) ? '' : storeName;

    item.retrieveData(requestData, cacheKey).then((response: any) => {
      item.updateStore(response);
    });
  });
}


export function createRequestStore(storeName:string, dataSource: BaseThunk){
  createStore(storeName, stores);
  createResponseCacheIfNotExists(storeName)
  subscribeToRequestStore(
    storeName,
    dataSource,
  );
}

export function clearRequestStores(){
  const thunks: any = [];
  Object.values(stores).forEach((item:RequestStoreData)=>{
    thunks.push(item.subscribers[0]);
  })
  stores = {};

  thunks.forEach((thunk:any)=>{
    createRequestStore(thunk.requestStoreId ?? '', thunk)
  })
}
