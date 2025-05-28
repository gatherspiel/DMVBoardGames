import { BaseThunkAction } from "./BaseThunkAction.ts";
import { BaseDispatcher } from "./BaseDispatcher.ts";

export class BaseThunk {
  thunkAction: BaseThunkAction;
  dispatchers: BaseDispatcher[];
  constructor(dataFetch: BaseThunkAction, dispatchers?: BaseDispatcher[]) {
    this.thunkAction = dataFetch;
    this.dispatchers = dispatchers ?? [];
  }

  async retrieveData(params: any) {
    return await this.thunkAction.retrieveData(params);
  }

  //TODO: Optimize the logic of subscribeComponent
  subscribeComponent(
    componentStoreName: string,
    reducerFunction: (a: any) => any,
    field?: string,
  ) {
    let stateNumber: number = -1;
    const newDispatcherName = parseInt(componentStoreName.split("-")[0]);

    let oldDispatcherIndex = -1;

    let i = 0;
    this.dispatchers.forEach(function (dispatcher: BaseDispatcher) {
      const number = parseInt(dispatcher.storeField.split("-")[1]);
      const dispatcherName = parseInt(dispatcher.storeField.split("-")[0]);
      if (number > stateNumber) {
        console.error("Cannot subscribe to an old component state");
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
    for (let dispatcher of this.dispatchers) {
      dispatcher.updateStore(response);
    }
  }
}
