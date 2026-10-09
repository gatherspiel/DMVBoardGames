import {DataStore} from "/lib/places-js-latest.js";

console.log(DataStore);
export const DELETE_GROUP_STORE = DataStore.createWithCustomLoadSignal({
  //TODO: Add load function 
  "storeName":"create-group-store"
});
