export function generateErrorMessage(message: string | string[] | undefined){
  if(Array.isArray(message)){
    let html = ''
    message.forEach((item)=>{
      html+=`<span class="error-message">${item.trim()}</span>`

    })
    return html;
  }
  return `
    ${message ? `<span class="error-message">${message.trim()}</span>` : ``}
  `
}

export function generateSuccessMessage(message: string | undefined) {
  return `
    ${message ? `<span class="success-message">${message}</span>` : ''}
  `
}