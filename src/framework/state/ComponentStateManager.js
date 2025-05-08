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

/**
 * Make sure a component is subscribed to a state.
 * @param stateName Name of state that the component will subscribe to.
 * @param component The component instance.
 */
export function subscribeToComponentState(stateName, component) {
  subscribeToState(stateName, component, states);
}

/**
 * Update the state for a component.
 * @param stateName The name of the component state.
 * @param updateFunction A function that returns the updated state that should be used.
 * @param data Data that should be passed to updateFunction.
 */
export function updateComponentState(stateName, updateFunction, data) {
  updateState(stateName, updateFunction, states, data);
}

export function getComponentState(stateName) {
  return states[stateName].data;
}
