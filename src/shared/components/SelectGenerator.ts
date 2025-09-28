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

const tags:string[] = ["Eurogames","Hidden identity games","Light games","Social games", "Wargames"]

export function getGameTypeTagSelectState(shadowRoot:ShadowRoot){
  const selectedTags:string[] = [];

  tags.forEach((tagName:string)=>{
    if((shadowRoot?.getElementById(tagName) as HTMLInputElement)?.checked){
      selectedTags.push(tagName);
    }
  })
  return selectedTags;
}

export function getGameTypeTagSelectHtml(checkState?: any){

  let html = `
    <div id="game-type-tag-select">
    <h2>Select group tags</h2>
  `

  tags.forEach((tagName:string)=>{
    html +=`
      <label for=${tagName}>${tagName}</label>
      <input id="${tagName}" name=${tagName} type="checkbox" ${checkState?.[tagName]}> 
    `
  })
  return html + `</div>`
}