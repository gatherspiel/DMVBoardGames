export function generateButton(config) {
  return `
    <button 
      class="${config.class ? ` ${config.class}` : ``}"
      name="action"
      value="${config.text}"
      ${config.type ? `type=${config.type}` : ``}
    >  
      <span class="front" ${config.id ? `id="${config.id}"` : ``}>${config.text}</span>   
    </button>
  `;
}
