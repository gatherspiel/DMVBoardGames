import { createStore, subscribeToStore } from "./StoreUtils.js";
import { addLoadFunction } from "./InitStoreManager.js";
import type { DefaultApiAction } from "../reducer/api/DefaultApiAction.ts";
import type { BaseReducer } from "../reducer/BaseReducer.ts";

const stores: Record<string, any> = {};
const responseCache: Record<string, any> = {};

const DEFAULT_API_ERROR_RESPONSE = function (responseData: any) {
  throw new Error(JSON.stringify(responseData, null, 2));
};

export function createRequestStore(
  storeName: string,
  dataSource: BaseReducer,
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
}

export function hasRequestStore(storeName: string): boolean {
  return storeName in stores;
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

    if (JSON.stringify(requestData) in responseCache[storeName]) {
      item.updateStore(responseCache[storeName][JSON.stringify(requestData)]);
    } else {
      item.retrieveData(requestData).then((response: any) => {
        responseCache[storeName][JSON.stringify(requestData)] = response;
        item.updateStore(response);
      });
    }
  });
}

export function initStoreOnLoad(config: any) {
  addLoadFunction(config.storeName, function () {
    function getRequestData() {
      return config.requestData;
    }

    createRequestStore(config.storeName, config.dataSource, getRequestData);

    if (config.dependencyUpdates) {
      config.dependencyUpdates();
    }
  });
}

export async function getResponseData(
  queryUrl: string,
  mockSettings?: DefaultApiAction,
) {
  try {
    const useMock = mockSettings?.defaultFunctionPriority;
    if (!useMock) {
      //The replace call is a workaround for an issue with url strings containing double quotes"
      const response = await fetch(queryUrl.replace(/"/g, ""));
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");

        const responseData: any = {
          status: response.status,
          message: "",
          endpoint: queryUrl,
        };
        mockSettings?.defaultFunction
          ? mockSettings?.defaultFunction(responseData)
          : DEFAULT_API_ERROR_RESPONSE(responseData);
      }

      const result = await response.json();
      return result;
    }
  } catch (e: any) {
    const responseData: any = {
      status: null,
      message: e.message,
      endpoint: queryUrl,
    };

    mockSettings?.defaultFunction
      ? mockSettings?.defaultFunction(responseData)
      : DEFAULT_API_ERROR_RESPONSE(responseData);
  }
  return mockSettings?.defaultFunction ? mockSettings.defaultFunction() : {};
}
