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


/**
 * Returns date in YYYY-MM-DD format.
 * @param date
 */
export function getDateFromDateString(date: string) {
  const dateObj = new Date(Date.parse(date));
  return `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`
}

export function getTimeFromDateString(date: string) {
  const dateObj = new Date(Date.parse(date));

  let displayMinutes = ""+dateObj.getMinutes();
  if(dateObj.getMinutes() < 10){
    displayMinutes = `0${displayMinutes}`;
  }
  console.log(dateObj.getMinutes());


  return `${dateObj.getHours()}:${displayMinutes}${dateObj.getHours()>=12 ?'PM':' AM'}`
}

export function combineDateAndTime(date: string, time: string){

  const dateSplit = date.split("-");
  if(dateSplit[1].length === 1) {
    dateSplit[1]=`0${dateSplit[1]}`
  }

  if(dateSplit[2].length === 1) {
    dateSplit[2]=`0${dateSplit[2]}`
  }

  const timeSplit = time.split(" ")[0].split(":");

  if(time.split(" ")[1].includes("PM") && timeSplit[0] !== '12'){
    timeSplit[0] = "" + (parseInt(timeSplit[0])+12)
  }

  if(timeSplit[0].length === 1){
    timeSplit[0]=`0${timeSplit[0]}`;
  }

  if(timeSplit[1].length === 1){
    timeSplit[1]=`0${timeSplit[1]}`;
  }

  var updated = `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}T${timeSplit[0]}:${timeSplit[1]}`
  console.log(updated)
  return updated;
}

export function convertDateTimeForDisplay(date: string){
  const dateObj:Date = new Date(Date.parse(date))

  let displayHours = dateObj.getHours();
  if(dateObj.getHours()>12) {
    displayHours = displayHours - 12;
  }

  let displayMinutes = ""+dateObj.getMinutes();
  if(dateObj.getMinutes() < 10){
    displayMinutes = `0${displayMinutes}`;
  }
  console.log(dateObj.getMinutes());

  const dateStr = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()} ` +
    `${displayHours}:${displayMinutes}${dateObj.getHours()>=12 ?'PM':' AM'}`
  return dateStr;
}

export function convertLocationStringForDisplay(location:string) {
  const split = location.split(',');
  return `${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()}`
}