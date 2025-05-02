import {
  createState,
  subscribeToState,
  updateState,
} from "./StateManagerUtils.js";

const states = {};

export function createComponentState(stateName, component) {
  createState(stateName, states);
  subscribeToComponentState(stateName, component);
}

export function subscribeToComponentState(stateName, component) {
  console.log("Subscribing with component:" + component);
  subscribeToState(stateName, component, states);
}

export function updateComponentState(stateName, updateFunction, data) {
  updateState(stateName, updateFunction, states, data);
}

export function getComponentState(stateName) {
  return states[stateName].data;
}
