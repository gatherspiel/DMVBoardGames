import {DAY_OF_WEEK_INPUT} from "../../ui/groups/Constants.ts";

export function getDayOfWeekSelectHtml(dayOfWeek:string){

  const selectedDayToDisplay = (dayOfWeek && dayOfWeek.length > 1) ?
    `${dayOfWeek.charAt(0)}${dayOfWeek.substring(1).toLowerCase()}` : ``

  let html = ` <select class="form-select" name=${DAY_OF_WEEK_INPUT}>`;

  (["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]).forEach((item:any)=>{
    html += `
      <option value=${item} ${item === selectedDayToDisplay ? `selected` : ``}> ${item}</option >
    `
  })

  html+=`</select>`

  return html
}