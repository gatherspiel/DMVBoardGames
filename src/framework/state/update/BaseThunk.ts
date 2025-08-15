import { BaseThunkAction } from "./BaseThunkAction.ts";
import { BaseDispatcher } from "./BaseDispatcher.ts";

import {updateGlobalStore} from "../data/GlobalStore.ts";
import {
  createRequestStore,
} from "../data/RequestStore.ts";
import type {BaseDynamicComponent} from "../../components/BaseDynamicComponent.ts";



export class BaseThunk {
  thunkAction: BaseThunkAction;
  dispatchers: BaseDispatcher[];

  globalStateReducer?: (a: any) => Record<string, string>;

  requestStoreId?: string;

  constructor(dataFetch: BaseThunkAction, dispatchers?: BaseDispatcher[]) {
    this.thunkAction = dataFetch;
    this.dispatchers = dispatchers ?? [];
  }

  createRequestStore(storeId:string){
    this.requestStoreId = storeId;
    createRequestStore(this.requestStoreId, this)
  }


  getRequestStoreId(){
    return this.requestStoreId;
  }

  async retrieveData(params: any, cacheKey?: string) {
    return await this.thunkAction.retrieveData(params, cacheKey);
  }

  addGlobalStateReducer(
    reducer: (a: any) => Record<string, any>,
  ): BaseThunk {
    this.globalStateReducer = reducer;
    return this;
  }

  subscribeComponent(
    component: BaseDynamicComponent,
    reducerFunction: (a: any) => any,
    field?: string,
  ) {


    let oldDispatcherIndex = -1;
    let i = 0;

    this.dispatchers.forEach((dispatcher: BaseDispatcher) => {
      if(dispatcher.getComponent() === component) {
        oldDispatcherIndex = i;
      } else {
        i++;
      }
    });

    if (oldDispatcherIndex !== -1) {
      this.dispatchers = this.dispatchers.splice(oldDispatcherIndex, 1);
    }
    this.dispatchers.push(
      new BaseDispatcher(component, reducerFunction, field),
    );
  }

  updateStore(response: any) {
    if (!this.globalStateReducer && this.dispatchers.length === 0) {
      console.error(
        "No dispatchers or global state reducer configured for API response " + this.thunkAction,
      );
      throw new Error("");
    }

    if (this.globalStateReducer) {
      const updates: Record<string, string> = this.globalStateReducer(
        response,
      ) as Record<string, string>;
      updateGlobalStore(updates);
    }

    for (let dispatcher of this.dispatchers) {
      dispatcher.updateStore(response);
    }
  }
}
