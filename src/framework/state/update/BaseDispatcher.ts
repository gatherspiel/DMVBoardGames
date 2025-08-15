/*
 Updates store after an API response is returned
 */
import type {BaseDynamicComponent} from "../../components/BaseDynamicComponent.ts";
import {BaseThunk} from "./BaseThunk.ts";

export class BaseDispatcher {
  storeField: BaseThunk | BaseDynamicComponent;
  reducerUpdate: (a: any) => any;
  responseField?: string;

  constructor(
    storeName: BaseThunk | BaseDynamicComponent,
    storeUpdate?: (a: any) => any,
    responseField?: string,
  ) {
    this.storeField = storeName;
    this.responseField = responseField;

    if(storeUpdate){
      this.reducerUpdate = storeUpdate;
    } else {
      this.reducerUpdate = (data:any)=>{
        return data;
      }
    }
  }

  getComponent(){
    return this.storeField;
  }

  updateStore(response: any) {
    const baseDispatcher: BaseDispatcher = this;
    const responseData = this.responseField
      ? response[this.responseField]
      : response;

    if (this.storeField instanceof BaseThunk) {
      (this.storeField as BaseThunk).retrieveData(
        responseData,
        baseDispatcher.reducerUpdate,
      )
    } else {
      (this.storeField as BaseDynamicComponent).updateWithCustomReducer(responseData,baseDispatcher.reducerUpdate)
    }
  }
}
