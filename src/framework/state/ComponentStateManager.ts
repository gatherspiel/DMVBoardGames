import {
  createState,
  subscribeToState,
  updateState,
} from "./StateManagerUtils.js";

const states: Record<string, any> = {};

export function createComponentState(
  stateName: string,
  component: HTMLElement,
) {
  createState(stateName, states);
  subscribeToComponentState(stateName, component);
}

/**
 * Make sure a component is subscribed to a state.
 * @param stateName Name of state that the component will subscribe to.
 * @param component The component instance.
 */
export function subscribeToComponentState(
  stateName: string,
  component: HTMLElement,
) {
  subscribeToState(stateName, component, states);
}

/**
 * Update the state for a component. This should only be called as a result of a user action or relevant API response.
 * @param stateName The name of the component state.
 * @param updateFunction A function that returns the updated state that should be used.
 * @param data Data that should be passed to updateFunction.
 */
export function updateComponentState(
  stateName: string,
  updateFunction: (a: any) => any,
  data: any,
) {
  updateState(stateName, updateFunction, states, data);
}

export function getComponentState(stateName: string) {
  return states[stateName].data;
}
