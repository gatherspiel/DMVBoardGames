import { BaseReducerAction } from "./BaseReducerAction.ts";
import { BaseDispatcher } from "./BaseDispatcher.ts";

export class BaseReducer {
  reducerAction: BaseReducerAction;
  dispatchers: BaseDispatcher[];

  constructor(dataFetch: BaseReducerAction, dispatchers: BaseDispatcher[]) {
    this.reducerAction = dataFetch;
    this.dispatchers = dispatchers;
  }

  async retrieveData(params: any) {
    return await this.reducerAction.retrieveData(params);
  }

  updateStore(response: any) {
    for (let dispatcher of this.dispatchers) {
      dispatcher.updateStore(response);
    }
  }
}
