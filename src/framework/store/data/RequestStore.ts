import { createStore, hasSubscribers, subscribeToStore } from "./StoreUtils.js";
import { addLoadFunction } from "./InitStoreManager.js";
import type { DefaultApiAction } from "../update/api/DefaultApiAction.ts";
import type { BaseThunk } from "../update/BaseThunk.ts";
import type {
  ComponentLoadConfig,
  RequestStoreItem,
} from "../../components/types/ComponentLoadConfig.ts";
import type { ApiRequestConfig } from "../update/api/types/ApiRequestConfig.ts";
import { ApiActionTypes } from "../update/api/types/ApiActionTypes.ts";

const stores: Record<string, any> = {};
const responseCache: Record<string, any> = {};

const DEFAULT_API_ERROR_RESPONSE = function (responseData: any) {
  throw new Error(JSON.stringify(responseData, null, 2));
};

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

    if (item.dispatchers.length === 0) {
      throw new Error(
        `No components are subscribed to request store: ${storeName}`,
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
        responseCache[storeName][JSON.stringify(requestData)] = response;
        item.updateStore(response);
      });
    }
  });
}

export function hasRequestStoreSubscribers(storeName: string): boolean {
  return hasSubscribers(storeName, stores);
}

export function initRequestStoresOnLoad(config: ComponentLoadConfig) {
  const onLoadConfig = config.onLoadStoreConfig;
  if (!onLoadConfig) {
    return;
  }
  addLoadFunction(onLoadConfig.storeName, function () {
    function getRequestData() {
      return config.onLoadRequestData;
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

    if (config.onLoadRequestConfig) {
      config.onLoadRequestConfig.forEach(function (
        requestStoreItem: RequestStoreItem,
      ) {
        createRequestStoreWithData(
          requestStoreItem.storeName,
          requestStoreItem.dataSource,
        );
      });
    }
  });
}

export async function getResponseData(
  queryConfig: ApiRequestConfig,
  mockSettings?: DefaultApiAction,
) {
  const url = queryConfig.url;
  const useDefault = mockSettings?.defaultFunctionPriority;

  try {
    if (!useDefault) {
      //The replace call is a workaround for an issue with url strings containing double quotes"
      const response = await fetch(url.replace(/"/g, ""), {
        method: queryConfig.method ?? ApiActionTypes.GET,
        headers: queryConfig.headers,
      });
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");

        const responseData: any = {
          status: response.status,
          message: "",
          endpoint: url,
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
      endpoint: url,
    };

    console.log("Error");
    mockSettings?.defaultFunction
      ? mockSettings?.defaultFunction(responseData)
      : DEFAULT_API_ERROR_RESPONSE(responseData);
  }
  return mockSettings?.defaultFunction ? mockSettings.defaultFunction() : {};
}
