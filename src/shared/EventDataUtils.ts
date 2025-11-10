const months = ['January', 'February','March', 'April','May', 'June','July','August','September','October','November','December'];
const validStates = ['DC', 'MD', 'VA'];


export function convertDateListToRange(dates: string[]){

  const startMonth = months[parseInt(dates[0].substring(5,7))-1];
  const startDate = `${dates[0].substring(8)}`
  const year = `${dates[0].substring(0,4)}`

  let endSection = ``;
  if(dates.length > 1) {
    const endMonth = months[parseInt(dates[dates.length-1].substring(5,7))-1];
    if(endMonth === startMonth) {
      endSection += `${dates[dates.length-1].substring(8)}`
    } else {
      endSection += `${endMonth} ${dates[dates.length-1].substring(8)}`
    }
    return `${startMonth} ${startDate} - ${endSection}, ${year}`
  }
  return `${startMonth} ${startDate}, ${year}`
}

export function combineDateAndTime(date: string, time: string){
  const dateSplit = date.split("-");
  if(dateSplit[1].length === 1) {
    dateSplit[1]=`0${dateSplit[1]}`
  }

  if(dateSplit[2].length === 1) {
    dateSplit[2]=`0${dateSplit[2]}`
  }
  return  `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}T${convertTimeTo24Hours(time)}`;
}


export function convertTimeTo24Hours(time:string){

  if(time.endsWith("AM")){
    time = time.split("AM")[0];
  }
  const timeSplit = time.split(" ")[0].split(":");

  if(time.split(" ")[1] && time.split(" ")[1].includes("PM") && timeSplit[0] !== '12'){
    timeSplit[0] = "" + (parseInt(timeSplit[0])+12)
  }

  if(!time.split(" ")[1]){
    if(timeSplit[1].includes("PM")){
      timeSplit[1]=timeSplit[1].substring(0,2);
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

export function convertDateAndDayToDisplayString(date:string,dayOfWeek?:string){

  const dateSplit = date.split("-")
  const dayOfWeekStr = dayOfWeek ? `${dayOfWeek},` : ``
  return `${dayOfWeekStr} ${months[parseInt(dateSplit[1])-1]} ${dateSplit[2]}`
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
  if(!validStates.includes(split[2].split(" ")[0].trim())){
    throw new Error("Invalid state code");
  }
}
