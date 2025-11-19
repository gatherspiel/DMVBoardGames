export function generateErrorMessage(message) {
  if (Array.isArray(message)) {
    let html = "";
    message.forEach((item) => {
      html += `<span class="error-message">${item.trim()}</span>`;
    });
    return html;
  }
  return `
    ${message ? `<span class="error-message">${message.trim()}</span>` : ``}
  `;
}

export function generateSuccessMessage(message) {
  return `
    ${message ? `<span class="success-message">${message}</span>` : ""}
  `;
}

export const SUCCESS_MESSAGE_KEY = "successMessage";
export const ERROR_MESSAGE_KEY = "errorMessage";
