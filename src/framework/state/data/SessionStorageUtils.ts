
//TODO: Make sure relevant cache items are cleared when saving data or just reload the page.

export function createResponseCacheIfNotExists(requestStoreName:string){
  if(!sessionStorage.getItem(requestStoreName)){
    createNewResponseCache(requestStoreName);
  }
}
export function createNewResponseCache(requestStoreName:string){
  sessionStorage.setItem(requestStoreName, JSON.stringify({}))
}

export function clearSessionStorage(){
  for(let i = 0; i< sessionStorage.length; i++){
    const key = sessionStorage.key(i) as string;
    createNewResponseCache(key);
  }
}

export function getRequestFromCache(requestStoreName:string, requestData: any){

  const dataStr = sessionStorage.getItem(requestStoreName);
  if(!dataStr){
    return null;
  }

  const data = JSON.parse(dataStr);

  if(!(Object.keys(data).length ===0) && requestData in data){
    return data[requestData];
  }
  return null;
}

export function updateCache(requestStoreName: string, requestData:any, response:any){

  const dataStr = sessionStorage.getItem(requestStoreName);
  if(!dataStr){
    throw new Error(`No cache defined for ${requestStoreName}`)
  }

  const data = JSON.parse(dataStr);
  data[requestData] = response;

  sessionStorage.setItem(requestStoreName, JSON.stringify(data));
}