import { createState, subscribeToState } from "./StateManagerUtils.js";
import { addLoadFunction } from "./LoadManager.js";
import type { MockResponse } from "../api/MockResponse.ts";

const states: Record<string, any> = {};
const responseCache: Record<string, any> = {};

export function createRequestState(stateName: string) {
  createState(stateName, states);
  responseCache[stateName] = {};
}

export function subscribeToRequestState(stateName: string, item: any) {
  subscribeToState(stateName, item, states);
}

export function updateRequestState(
  stateName: string,
  updateFunction: any,
  data: any,
) {
  if (!(stateName in states)) {
    createState(stateName);
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
    createRequestState(config.stateName);
    subscribeToRequestState(config.stateName, config.dataSource);
    updateRequestState(
      config.stateName,
      function () {
        return config.requestData;
      },
      null,
    );

    if (config.dependencyUpdates) {
      config.dependencyUpdates();
    }
  });
}

export async function getResponseData(
  queryUrl: string,
  mockSettings: MockResponse,
) {
  try {
    const useMock = mockSettings?.useMockByDefault;
    if (!useMock) {
      //The replace call is a workaround for an issue with url strings containing double quotes"
      const response = await fetch(queryUrl.replace(/"/g, ""));
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");

        mockSettings.mockFunction ? mockSettings.mockFunction() : {};
      }

      const result = await response.json();
      return result;
    }
  } catch (e) {
    console.log(
      `Error when calling endpoint: ${queryUrl}. A mock will be used`,
    );
  }
  return mockSettings.mockFunction ? mockSettings.mockFunction() : {};
}

//TODO: Create base component class.
