import { createState, subscribeToState } from "./StateManagerUtils.js";
import { addLoadFunction } from "./LoadManager.js";
import type { DefaultResponse } from "../api/DefaultResponse.ts";
import type { BaseAPI } from "../api/BaseAPI.ts";

const states: Record<string, any> = {};
const responseCache: Record<string, any> = {};

export function createRequestState(
  stateName: string,
  dataSource: BaseAPI,
  initState: () => any = () => {
    return { load: true };
  },
) {
  createState(stateName, states);
  responseCache[stateName] = {};

  subscribeToRequestState(stateName, dataSource);
  updateRequestState(stateName, initState, null);
}

export function subscribeToRequestState(stateName: string, item: any) {
  subscribeToState(stateName, item, states);
}

/**
 * Updates the request state for an API call. This should only be called upon a component's initial render or when
 *  a user action requires a request state
 * @param stateName
 * @param dataSource
 * @param initState
 */
export function updateRequestState(
  stateName: string,
  updateFunction: (a?: any) => any,
  data?: any,
) {
  if (!(stateName in states)) {
    createState(stateName, states);
  }

  if (!data) {
    data = states[stateName].data;
  }

  states[stateName].data = {
    ...updateFunction(data),
  };
  states[stateName].subscribers.forEach(function (item: any) {
    const requestData = states[stateName].data;

    if (JSON.stringify(requestData) in responseCache[stateName]) {
      item.updateData(responseCache[stateName][JSON.stringify(requestData)]);
    } else {
      item.retrieveData(requestData).then((response: any) => {
        responseCache[stateName][JSON.stringify(requestData)] = response;
        item.updateData(response);
      });
    }
  });
}

export function initStateOnLoad(config: any) {
  addLoadFunction(config.stateName, function () {
    function getRequestData() {
      return config.requestData;
    }
    createRequestState(config.stateName, config.dataSource, getRequestData);

    if (config.dependencyUpdates) {
      config.dependencyUpdates();
    }
  });
}

export async function getResponseData(
  queryUrl: string,
  mockSettings: DefaultResponse,
) {
  try {
    const useMock = mockSettings?.defaultFunctionPriority;
    if (!useMock) {
      //The replace call is a workaround for an issue with url strings containing double quotes"
      const response = await fetch(queryUrl.replace(/"/g, ""));
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");

        mockSettings.defaultFunction ? mockSettings.defaultFunction() : {};
      }

      const result = await response.json();
      return result;
    }
  } catch (e) {
    console.log(
      `Error when calling endpoint: ${queryUrl}. A mock will be used`,
    );
  }
  return mockSettings.defaultFunction ? mockSettings.defaultFunction() : {};
}
