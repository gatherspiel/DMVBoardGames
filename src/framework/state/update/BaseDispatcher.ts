/*
 Updates store after an API response is returned
 */
import { updateRequestStore } from "../data/RequestStore.ts";
import type {BaseDynamicComponent} from "../../components/BaseDynamicComponent.ts";

export class BaseDispatcher {
  storeField: string | BaseDynamicComponent;
  reducerUpdate: (a: any) => any;
  responseField?: string;

  constructor(
    storeName: string | BaseDynamicComponent,
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

    if ((typeof this.storeField )== "string") {
      updateRequestStore(
        baseDispatcher.storeField as string,
        baseDispatcher.reducerUpdate,
        responseData,
      );
    } else {
      (this.storeField as BaseDynamicComponent).updateWithCustomReducer(baseDispatcher.reducerUpdate, responseData)
    }
  }
}
