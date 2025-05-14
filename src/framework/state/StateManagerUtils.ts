import type { BaseAPI } from "../api/BaseAPI.ts";
import type { BaseDynamicComponent } from "../components/BaseDynamicComponent.ts";

export function createState(stateName: string, states: any) {
  if (stateName in states) {
    console.warn(`State with name ${stateName} already exists`);
  }
  states[stateName] = {
    data: {},
    subscribers: [],
  };
}

export function subscribeToState(stateName: string, item: any, states: any) {
  if (!(stateName in states)) {
    createState(stateName, states);
  }

  if (!states[stateName].subscribers.includes(item)) {
    states[stateName].subscribers.push(item);
  }
}

export function updateState(
  stateName: string,
  updateFunction: (a: any) => any,
  states: any,
  data: any,
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

  states[stateName].subscribers.forEach(function (
    component: BaseDynamicComponent | BaseAPI,
  ) {
    component.updateData(states[stateName].data);
  });
}
