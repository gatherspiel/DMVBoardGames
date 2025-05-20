import type { BaseReducer } from "../update/BaseReducer.ts";
import type { BaseDynamicComponent } from "../components/BaseDynamicComponent.ts";

export function createStore(storeName: string, stores: any) {
  if (storeName in stores) {
    console.warn(`Store with name ${storeName} already exists`);
  }
  stores[storeName] = {
    data: {},
    subscribers: [],
  };
}

export function subscribeToStore(storeName: string, item: any, store: any) {
  if (!(storeName in store)) {
    createStore(storeName, store);
  }

  if (!store[storeName].subscribers.includes(item)) {
    store[storeName].subscribers.push(item);
  }
}

export function updateStore(
  storeName: string,
  updateFunction: (a: any) => any,
  storeData: Record<string, any>,
  data: any,
) {
  if (!(storeName in storeData)) {
    createStore(storeName, storeData);
  }

  if (!data) {
    data = storeData[storeName].data;
  }

  const updatedData = updateFunction(data);

  Object.keys(storeData[storeName].data).forEach(function (key) {
    if (!(key in updatedData)) {
      updatedData[key] = storeData[storeName].data[key];
    }
  });
  storeData[storeName].data = updatedData;

  if (storeData[storeName].subscribers.length === 0) {
    console.warn(`No subscribers to store ${storeName}`);
  }

  storeData[storeName].subscribers.forEach(function (
    component: BaseDynamicComponent | BaseReducer,
  ) {
    if (!component || !(typeof component.updateStore === "function")) {
      throw new Error(
        `updateStore function not defined for component ${component.constructor.name}`,
      );
    }
    component.updateStore(storeData[storeName].data);
  });
}
