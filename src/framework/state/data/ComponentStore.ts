import { createStore, subscribeToStore, updateStore } from "./StoreUtils.js";

let stores: Record<string, any> = {};

export function createComponentStore(
  storeName: string,
  component: HTMLElement,
  defaultData?:any
) {
  createStore(storeName, stores, defaultData);
  subscribeComponentToStore(storeName, component);
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

export function clearSubscribers(storeName:string){
 if(storeName in stores){
   delete stores[storeName]
 }
}

/**
 * @Depreacted
 * @param storeName
 */
export function getComponentStore(storeName: string) {
  return stores[storeName].data;
}

export function hasUserEditPermissions(componentStoreName:string){
  return getComponentStore(componentStoreName)?.permissions?.userCanEdit
}

export function clearComponentStores(){
  stores = {};
}
