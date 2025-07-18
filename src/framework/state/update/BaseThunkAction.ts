export abstract class BaseThunkAction {
  abstract retrieveData(params: any, cacheKey?: string): any;
}
