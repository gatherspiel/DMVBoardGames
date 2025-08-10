import {SUCCESS_MESSAGE_KEY} from "../../../shared/Constants.ts";


export function generateLoadingIndicator(){
  return `<h1>Loading</h1>`
}

export function generateErrorMessage(message: string | string[] | undefined){
  if(Array.isArray(message)){
    let html = ''
    message.forEach((item)=>{
      html+=`<p class="error-message">${item.trim()}</p>`

    })
    return html;
  }
  return `
    <p class="error-message">${message? message.trim() : ""}</p>
  `
}

export function generateSuccessMessage(message: string | undefined) {
  return `
    ${message ? `<p class="${SUCCESS_MESSAGE_KEY}">${message}</p>` : ''}
  }`
}