import {
  createState,
  subscribeToState,
  updateState,
} from "./StateManagerUtils.js";
import { addLoadFunction } from "./LoadManager.js";

const states = {};
const responseCache = {};

export function createRequestState(stateName) {
  createState(stateName, states);
  responseCache[stateName] = {};
}

export function subscribeToRequestState(stateName, item) {
  subscribeToState(stateName, item, states);
}

export function updateRequestState(stateName, updateFunction, data) {
  if (!(stateName in states)) {
    createState(stateName);
  }

  if (!data) {
    data = states[stateName].data;
  }

  states[stateName].data = {
    ...updateFunction(data),
  };
  states[stateName].subscribers.forEach(function (item) {
    const requestData = states[stateName].data;

    if (JSON.stringify(requestData) in responseCache[stateName]) {
      item.updateData(responseCache[stateName][JSON.stringify(requestData)]);
    } else {
      item.retrieveData(requestData).then((response) => {
        responseCache[stateName][JSON.stringify(requestData)] = response;
        item.updateData(response);
      });
    }
  });
}

export function initStateOnLoad(config) {
  addLoadFunction(config.stateName, function () {
    createRequestState(config.stateName);
    subscribeToRequestState(config.stateName, config.dataSource);
    updateRequestState(config.stateName, function () {
      return config.requestData;
    });

    if (config.dependencyUpdates) {
      config.dependencyUpdates();
    }
  });
}

export async function getResponseData(queryUrl, mockSettings) {
  try {
    if (
      !mockSettings.useMockByDefault ||
      mockSettings.useMockByDefault === "false"
    ) {
      //The replace call is a workaround for an issue with url strings containing double quotes"
      const response = await fetch(queryUrl.replace(/"/g, ""));
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");
        return mockSettings.mockFunction();
      }

      const result = await response.json();
      return result;
    }
  } catch (e) {
    console.log(
      `Error when calling endpoint: ${queryUrl}. A mock will be used`,
    );
  }
  return mockSettings.mockFunction();
}
