import { createStore, subscribeToStore, updateStore } from "./StoreUtils.js";
import { hasSubscribers } from "./StoreUtils.js";

const stores: Record<string, any> = {};

export function createComponentStore(
  storeName: string,
  component: HTMLElement,
) {
  createStore(storeName, stores);
  subscribeComponentToStore(storeName, component);
}

export function hasComponentStoreSubscribers(storeName: string): boolean {
  return hasSubscribers(storeName, stores);
}
/**
 * Make sure a component is subscribed to a store.
 * @param store Name of store that the component will subscribe to.
 * @param component The component instance.
 */
export function subscribeComponentToStore(
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
