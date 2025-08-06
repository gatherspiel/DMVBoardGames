export function getLocalStorageDataIfPresent(key: string): any {
  const data = window.localStorage.getItem(key);

  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

export function addLocalStorageData(key:string, data:any){
  window.localStorage.setItem(key, data);
}
export function deleteLocalStoreData(key: string){
  if(window.localStorage.getItem(key)){
    window.localStorage.removeItem(key);
  }
}
