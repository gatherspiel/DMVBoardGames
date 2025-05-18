import {
  createState,
  subscribeToState,
  updateState,
} from "./StateManagerUtils.js";
import { ReadOnlyState } from "./ReadOnlyState.ts";

const states: Record<string, any> = {};
const readOnlyStates: ReadOnlyState[] = [];

export function addReadOnlyState(state: ReadOnlyState) {
  readOnlyStates.push(state);
}

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
  data?: any,
) {
  updateState(stateName, updateFunction, states, data);
}

/**
 * @Depreacted
 * @param stateName
 */
export function getComponentState(stateName: string) {
  return states[stateName].data;
}

export function getDataFromState(stateName: string, param: string): string {
  const state = states[stateName];
  console.log(stateName);
  console.log(typeof state);
  console.log(readOnlyStates.length);
  if (!readOnlyStates.includes(state)) {
    throw new Error(
      `getData can only be used for states that are defined as an instance of ReadOnlyState`,
    );
  }

  return state.getValue(param) ?? "";
}

export function hasComponentState(stateName: string): boolean {
  return stateName in states;
}
