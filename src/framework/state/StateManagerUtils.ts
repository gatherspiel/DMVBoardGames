import type { BaseUpdater } from "../update/BaseUpdater.ts";
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
  states: Record<string, any>,
  data: any,
) {
  if (!(stateName in states)) {
    createState(stateName, states);
  }

  if (!data) {
    data = states[stateName].data;
  }

  const updatedData = updateFunction(data);

  Object.keys(states[stateName].data).forEach(function (key) {
    if (!(key in updatedData)) {
      updatedData[key] = states[stateName].data[key];
    }
  });
  states[stateName].data = updatedData;

  if (states[stateName].subscribers.length === 0) {
    console.warn(`No subscribers to state ${stateName}`);
  }

  states[stateName].subscribers.forEach(function (
    component: BaseDynamicComponent | BaseUpdater,
  ) {
    component.updateData(states[stateName].data);
  });
}
