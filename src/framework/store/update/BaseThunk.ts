import { BaseThunkAction } from "./BaseThunkAction.ts";
import { BaseDispatcher } from "./BaseDispatcher.ts";
import { cacheEnabledForThunkSubscription } from "../data/RequestStore.ts";
import { updateGlobalStore } from "../data/StoreUtils.ts";

export class BaseThunk {
  thunkAction: BaseThunkAction;
  dispatchers: BaseDispatcher[];

  globalStateReducer?: (a: any) => any;

  constructor(dataFetch: BaseThunkAction, dispatchers?: BaseDispatcher[]) {
    this.thunkAction = dataFetch;
    this.dispatchers = dispatchers ?? [];
  }

  async retrieveData(params: any) {
    return await this.thunkAction.retrieveData(params);
  }

  //TODO: Optimize the logic of subscribeComponent
  subscribeRequestStore(requestStore: string) {
    if (cacheEnabledForThunkSubscription(requestStore, this)) {
      throw Error(
        `Cache is enabled for request store ${requestStore} subscribed to thunk`,
      );
    }
    this.dispatchers.push(
      new BaseDispatcher(requestStore, function () {
        return {};
      }),
    );
  }

  addGlobalStateReducer(reducer: (a: any) => any): BaseThunk {
    this.globalStateReducer = reducer;
    return this;
  }

  subscribeComponent(
    componentStoreName: string,
    reducerFunction: (a: any) => any,
    field?: string,
  ) {
    let stateNumber: number = -1;
    const newDispatcherName = componentStoreName.split("-")[0];

    let oldDispatcherIndex = -1;

    let i = 0;
    this.dispatchers.forEach(function (dispatcher: BaseDispatcher) {
      const number = parseInt(dispatcher.storeField.split("-")[1]);
      const dispatcherName = dispatcher.storeField.split("-")[0];

      if (number > stateNumber && dispatcherName === newDispatcherName) {
        throw new Error(
          `Cannot subscribe ${dispatcherName} to an old component state`,
        );
      }
      if (dispatcherName === newDispatcherName) {
        oldDispatcherIndex = i;
      }
      i++;
    });

    if (oldDispatcherIndex !== -1) {
      this.dispatchers = this.dispatchers.splice(oldDispatcherIndex, 1);
    }
    this.dispatchers.push(
      new BaseDispatcher(componentStoreName, reducerFunction, field),
    );
  }

  updateStore(response: any) {
    if (this.dispatchers.length === 0) {
      console.error(
        "No dispatchers configured for API response " + this.thunkAction,
      );
      throw new Error("");
    }

    if (this.globalStateReducer) {
      updateGlobalStore(this.globalStateReducer(response));
    }

    for (let dispatcher of this.dispatchers) {
      dispatcher.updateStore(response);
    }
  }
}
