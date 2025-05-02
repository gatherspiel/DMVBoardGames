import {
  createState,
  subscribeToState,
  updateState,
} from "./StateManagerUtils.js";

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

export function getRequestState(stateName) {
  return states[stateName].data;
}
