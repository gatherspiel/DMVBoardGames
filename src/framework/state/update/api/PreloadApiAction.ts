import {BaseThunkAction} from "../BaseThunkAction.ts";

export class PreloadApiAction extends BaseThunkAction{

  async retrieveData(): Promise<any>{

    let promise = new Promise(function(resolve){
      const id = setInterval(function(){

        console.log("Waiting");
        // @ts-ignore
        if(window.preloadData) {
          clearInterval(id);
          // @ts-ignore
          console.log("Time since navbar load:"+(Date.now()-window.start))
          // @ts-ignore
          resolve(window.preloadData)
        }
      },10)
    });
    return promise;
  }

}



