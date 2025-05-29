export function getLocalStorageDataIfPresent(key: string): any {
  const data = window.localStorage.getItem(key);

  if (!data) {
    return null;
  }
  return JSON.parse(data);
}
