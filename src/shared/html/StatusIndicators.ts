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
    ${message ? `<p class="success-message">${message}</p>` : ''}
  `
}