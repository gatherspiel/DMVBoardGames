const daysOfWeek= ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
const tags = ["Eurogames","Hidden identity games","Light games","Social games", "Wargames"]

export const DEFAULT_SEARCH_PARAMETER = "any";

export function getDropdownHtml(dropdownConfig) {
  return ` 
    <select class="form-select" id=${dropdownConfig.id}>
      ${dropdownConfig.data?.map(
        (item) =>
          `<option value="${item}" ${item === dropdownConfig.selected ? "selected" : ""}>
            ${
              item === DEFAULT_SEARCH_PARAMETER
              ? dropdownConfig.defaultParameterDisplay
              : item
            }
          </option>`,
        )}
    </select>`;
}

export function generateCheckedStateFromUrlParamArray(data){
  let state = {};

  if(!data){
    return state;
  }

  data.split(",").forEach((item)=>{
    state[item]="checked";
  })
  return state;
}

export const DAY_OF_WEEK_INPUT = "day-of-week"

export function getDayOfWeekSelectHtml(dayOfWeek){

  const selectedDayToDisplay = (dayOfWeek && dayOfWeek.length > 1) ?
    `${dayOfWeek.charAt(0)}${dayOfWeek.substring(1).toLowerCase()}` : ``

  let html = ` <select class="form-select" name=${DAY_OF_WEEK_INPUT}>`;
  daysOfWeek.forEach((item)=>{
    html += `
      <option value=${item} ${item === selectedDayToDisplay ? `selected` : ``}> ${item}</option >
    `
  })
  html+=`</select>`
  return html
}


export function getTagSelectedState(shadowRoot){
  const selectedTags = {};

  tags.forEach((tagName)=>{
    if(shadowRoot.getElementById(tagName)?.checked){
      selectedTags[tagName]="checked";
    }
  })
  return selectedTags;
}

export function getDaysOfWeekSelectedState(shadowRoot){
  const selectedDays = {};

  daysOfWeek.forEach((day)=>{
    if(shadowRoot.getElementById(day)?.checked){
      selectedDays[day]="checked";
    }
  })
  return selectedDays;
}

export function getDaysOfWeekSelectHtml(checkState){

  let html = `
    <div id="days-of-week-select">
  `

  let i = 0;
  daysOfWeek.forEach((day)=>{
    html +=`
      <label for=${day} ${i>0? `class="label-border-left" `: ``}> ${day}</label>
      <input id="${day}" name=${day} type="checkbox" ${checkState?.[day]}> 
    `
    i++;
  })
  return html + `</div>`
}

export function getGameTypeTagSelectHtml(checkState){

  let html = `
    <div id="game-type-tag-select">
    <label class="">Tags(optional)</label>
  `

  let i = 0;
  tags.forEach((tagName)=>{
    html +=`
      <label for=${tagName} ${i>0? `class="label-border-left" `: ``}> ${tagName}</label>
      <input id="${tagName}" name=${tagName} type="checkbox" ${checkState?.[tagName]}> 
    `
    i++;
  })
  return html + `</div>`
}