/*
 Updates store after an API response is returned
 */
import { updateComponentStore } from "../data/ComponentStore.ts";
import { hasRequestStore, updateRequestStore } from "../data/RequestStore.ts";

export class BaseDispatcher {
  storeField: string;
  reducerUpdate: (a: any) => any;
  responseField?: string;

  constructor(
    storeName: string,
    storeUpdate?: (a: any) => any,
    responseField?: string,
  ) {
    this.storeField = storeName;
    this.responseField = responseField;

    if(storeUpdate){
      this.reducerUpdate = storeUpdate;
    } else {
      this.reducerUpdate = function(data:any){
        return data;
      }
    }
  }

  /*
    This updates the relevant component stores after data has been updated. State is not saved here, and it is sent
    to any subscribed components.

     Components should not be able to directly query state. If multiple components need parts of the same data, they
     will receive pieces of the data that they need. If one of these components makes an update to the data, then
     a request will be made to update the state, and then necessary updates will be sent.

     TODO: Possible future enhancements

      -Consider having each object be in a store, then have component reducers subscribe to that store. Right now,
      component reducers are based on the action and not the data.


   */
  updateStore(response: any) {
    const baseDispatcher: BaseDispatcher = this;
    const responseData = this.responseField
      ? response[this.responseField]
      : response;

    if (hasRequestStore(baseDispatcher.storeField)) {
      updateRequestStore(
        baseDispatcher.storeField,
        baseDispatcher.reducerUpdate,
        responseData,
      );
    } else {
      updateComponentStore(
        baseDispatcher.storeField,
        baseDispatcher.reducerUpdate,
        responseData,
      );
    }
  }
}
