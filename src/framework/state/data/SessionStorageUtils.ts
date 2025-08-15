
export function createResponseCacheIfNotExists(requestStoreName:string){
  if(!sessionStorage.getItem(requestStoreName)){
    createSessionStoreCache(requestStoreName);
  }
}

export function createSessionStoreCache(requestStoreName:string){
  sessionStorage.setItem(requestStoreName, JSON.stringify({}))
}

export function clearSessionStorage(){
  for(let i = 0; i< sessionStorage.length; i++){
    const key = sessionStorage.key(i) as string;
    createSessionStoreCache(key);
  }
}

export function getItemFromSessionStorage(requestStoreName:string, requestData: any){

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

export function updateSessionStorage(requestStoreName: string, requestData:any, response:any){

  const dataStr = sessionStorage.getItem(requestStoreName);
  if(!dataStr){
    throw new Error(`No cache defined for ${requestStoreName}`)
  }

  const data = JSON.parse(dataStr);
  data[requestData] = response;

  sessionStorage.setItem(requestStoreName, JSON.stringify(data));
}