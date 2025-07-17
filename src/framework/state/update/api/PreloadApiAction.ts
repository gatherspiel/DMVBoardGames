import {BaseThunkAction} from "../BaseThunkAction.ts";

export class PreloadApiAction extends BaseThunkAction{

  async retrieveData(params: any, cacheKey?: string): Promise<any>{

    console.log(params+cacheKey);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let promise = new Promise(function(resolve){
      const id = setInterval(function(){

        // @ts-ignore
        if(window.preloadData) {
          clearInterval(id);
          // @ts-ignore
          resolve(window.preloadData)
        }
      },10)
    });
    return promise;
  }

}



