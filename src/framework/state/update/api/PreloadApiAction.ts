import {BaseThunkAction} from "../BaseThunkAction.ts";

export class PreloadApiAction extends BaseThunkAction{

  async retrieveData(): Promise<any>{

    let promise = new Promise(resolve=>{
      const id = setInterval(()=>{

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



