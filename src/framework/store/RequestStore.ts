import { createStore, hasSubscribers, subscribeToStore } from "./StoreUtils.js";
import { addLoadFunction } from "./InitStoreManager.js";
import type { DefaultApiAction } from "../reducer/api/DefaultApiAction.ts";
import type { BaseReducer } from "../reducer/BaseReducer.ts";
import type {
  RequestStoreConfig,
  RequestStoreItem,
} from "./types/RequestStoreConfig.ts";

const stores: Record<string, any> = {};
const responseCache: Record<string, any> = {};

const DEFAULT_API_ERROR_RESPONSE = function (responseData: any) {
  throw new Error(JSON.stringify(responseData, null, 2));
};

export function createRequestStoreWithData(
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

    //TODO: If a response would invalidate a cache item, do a page refresh or clear the whole cache.
    console.log(requestData);
    if (
      requestData &&
      Object.keys(requestData).length > 0 &&
      JSON.stringify(requestData) in responseCache[storeName]
    ) {
      item.updateStore(responseCache[storeName][JSON.stringify(requestData)]);
    } else {
      console.log(storeName);
      item.retrieveData(requestData).then((response: any) => {
        responseCache[storeName][JSON.stringify(requestData)] = response;
        item.updateStore(response);
      });
    }
  });
}

export function hasRequestStoreSubscribers(storeName: string): boolean {
  return hasSubscribers(storeName, stores);
}

export function initRequestStoresOnLoad(config: RequestStoreConfig) {
  const onLoadConfig = config.onLoadStoreConfig;
  addLoadFunction(onLoadConfig.storeName, function () {
    function getRequestData() {
      return config.requestData;
    }

    createRequestStoreWithData(
      onLoadConfig.storeName,
      onLoadConfig.dataSource,
      getRequestData,
    );

    if (config.requestStoresToCreate) {
      config.requestStoresToCreate.forEach(function (
        requestStoreItem: RequestStoreItem,
      ) {
        createStore(requestStoreItem.storeName, stores);
        responseCache[requestStoreItem.storeName] = {};
        subscribeToRequestStore(
          requestStoreItem.storeName,
          requestStoreItem.dataSource,
        );
      });
    }

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

    console.log("Error");
    mockSettings?.defaultFunction
      ? mockSettings?.defaultFunction(responseData)
      : DEFAULT_API_ERROR_RESPONSE(responseData);
  }
  return mockSettings?.defaultFunction ? mockSettings.defaultFunction() : {};
}
