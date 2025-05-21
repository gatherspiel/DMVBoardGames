import { createStore, subscribeToStore, updateStore } from "./StoreUtils.js";
import { GlobalReadOnlyStore } from "./GlobalReadOnlyStore.ts";

const stores: Record<string, any> = {};
const readOnlyStores: GlobalReadOnlyStore[] = [];

export function createComponentStore(
  storeName: string,
  component: HTMLElement,
) {
  createStore(storeName, stores);
  subscribeToComponentStore(storeName, component);
}

/**
 * Make sure a component is subscribed to a store.
 * @param store Name of store that the component will subscribe to.
 * @param component The component instance.
 */
export function subscribeToComponentStore(
  storeName: string,
  component: HTMLElement,
) {
  subscribeToStore(storeName, component, stores);
}

/**
 * Update the store for a component. This should only be called as a result of a user action or relevant API response.
 * @param storeName The name of the component store.
 * @param updateFunction A function that returns the updated store should be used.
 * @param data Data that should be passed to updateFunction.
 */
export function updateComponentStore(
  storeName: string,
  updateFunction: (a: any) => any,
  data?: any,
) {
  updateStore(storeName, updateFunction, stores, data);
}

/**
 * @Depreacted
 * @param storeName
 */
export function getComponentStore(storeName: string) {
  return stores[storeName].data;
}

export function addReadOnlyStore(store: GlobalReadOnlyStore) {
  readOnlyStores.push(store);
}

export function getDataFromStore(storeName: string, param: string): string {
  const store = stores[storeName];
  if (!(store instanceof GlobalReadOnlyStore)) {
    throw new Error(
      `Cannot retrieve data from store:${storeName} getData can only be used for store that are defined as an instance of ImmutableStore`,
    );
  }

  return store.getValue(param) ?? "";
}

export function hasComponentStore(storeName: string): boolean {
  return storeName in stores;
}
