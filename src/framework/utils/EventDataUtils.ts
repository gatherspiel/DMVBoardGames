const months = ['January', 'February','March', 'April','May', 'June','July','August','September','October','November','December'];
const validStates = ['DC', 'MD', 'VA'];
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

  let hours = dateObj.getHours();
  if(dateObj.getHours()>12) {
    hours = hours -12;
  }
  return `${hours}:${displayMinutes}${dateObj.getHours()>=12 ?'PM':' AM'}`
}

export function combineDateAndTime(date: string, time: string){
  const dateSplit = date.split("-");
  if(dateSplit[1].length === 1) {
    dateSplit[1]=`0${dateSplit[1]}`
  }

  if(dateSplit[2].length === 1) {
    dateSplit[2]=`0${dateSplit[2]}`
  }
  var updated = `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}T${convertTimeTo24Hours(time)}`
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

  const dateStr = `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()} ` +
    `${displayHours}:${displayMinutes}${dateObj.getHours()>=12 ?'PM':' AM'}`
  return dateStr;
}

export function convertTimeTo24Hours(time:string){
  const timeSplit = time.split(" ")[0].split(":");

  if(time.split(" ")[1] && time.split(" ")[1].includes("PM") && timeSplit[0] !== '12'){
    timeSplit[0] = "" + (parseInt(timeSplit[0])+12)
  }

  if(!time.split(" ")[1]){
    if(timeSplit[1].includes("PM")){
      timeSplit[1]=timeSplit[1].substring(0,1);
      if(timeSplit[0] !== '12' && parseInt(timeSplit[0]) <12){
        timeSplit[0] = "" + (parseInt(timeSplit[0])+12)

      }
    }
  }

  if(timeSplit[0].length === 1){
    timeSplit[0]=`0${timeSplit[0]}`;
  }

  if(timeSplit[1].length === 1){
    timeSplit[1]=`0${timeSplit[1]}`;
  }

  return `${timeSplit[0]}:${timeSplit[1]}`
}

export function convertLocationStringForDisplay(location:string) {
  if(!location){
    return ""
  }
  const split = location.split(',');
  return `${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()}`
}

export function validateDateFormat(date: string){
  const split= date.split("-");

  if(split.length !== 3 || split[0].length !== 4 || split[1].length !== 2 || split[2].length !== 2){
    throw new Error("Date must be in YYYY-MM-DD format. Example: 2025-07-07")
  }
}

export function validateAddress(addressStr:string) {
  const split = addressStr.split(",");

  if(split.length !==3 || split[2].trim().split(" ").length !==2 ) {
    throw new Error("Invalid address format. Address should be in the form 'street, city, state_code zip_code ")
  }
  if(!validStates.includes(split[2].split(" ")[1].trim())){
    throw new Error("Invalid state code");
  }
}