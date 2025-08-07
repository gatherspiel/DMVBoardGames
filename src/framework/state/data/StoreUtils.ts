import { BaseThunk } from "../update/BaseThunk.ts";
import type { BaseDynamicComponent } from "../../components/BaseDynamicComponent.ts";

export function createStore(storeName: string, stores: any) {
  if (!storeName) {
    throw new Error(`createStore must be called with a valid store name`);
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

  if (!updatedData) {
    throw new Error(
      `Update function for store ${storeName} must return a JSON object`,
    );
  }

  Object.keys(storeData[storeName].data).forEach(function (key) {
    if (!(key in updatedData)) {
      updatedData[key] = storeData[storeName].data[key];
    }
  });
  storeData[storeName].data = updatedData;

  storeData[storeName].subscribers.forEach(function (
    component:  BaseDynamicComponent| BaseThunk,
  ) {

    if(component instanceof BaseThunk){
      component.updateStore(storeData[storeName].data);
    } else {
      (component as BaseDynamicComponent).updateWithStoreData(storeData[storeName].data);
    }
  });
}
