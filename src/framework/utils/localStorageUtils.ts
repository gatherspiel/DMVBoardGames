export async function getLocalStorageData(key: string): Promise<any> {
  const data = window.localStorage.getItem(key);

  if (!data) {
    throw new Error(`Could not find data with key:${key} in local storage`);
  }
  return await JSON.parse(data);
}
