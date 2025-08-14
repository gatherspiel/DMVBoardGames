export function getLocalStorageDataIfPresent(key: string): any {
  const data = window.localStorage.getItem(key);
  return data ? JSON.parse(data): null;
}

export function addLocalStorageData(key:string, data:any){
  window.localStorage.setItem(key, data);
}
export function deleteLocalStoreData(key: string){
  if(window.localStorage.getItem(key)){
    window.localStorage.removeItem(key);
  }
}
