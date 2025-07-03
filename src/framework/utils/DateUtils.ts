/**
 * Returns true if the timestamp is after the current moment, and returns false otherwise.
 * @param timestamp timestamp in seconds
 */
export function isAfterNow(timestamp: number): boolean {
  return timestamp * 1000 > new Date().getTime();
}

export function convertDayOfWeekForDisplay(day:string){
  return `${day.substring(0,1).toUpperCase()}${day.substring(1).toLowerCase()}`
}
const months = ['January', 'February','March', 'April','May', 'June','July','August','September','October','November','December'];

export function convertDateTimeForDisplay(date: string){

  const dateObj:Date = new Date(Date.parse(date))
  const dateStr = `${months[dateObj.getMonth()]} ${dateObj.getDay()}, ${dateObj.getFullYear()} ` +
    `${dateObj.getHours()}:${dateObj.getMinutes()}${dateObj.getHours()>=12 ?'PM':' AM'}`
  return dateStr;
}

export function convertLocationStringForDisplay(location:string) {
  const split = location.split(',');

  return `${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()}`
}