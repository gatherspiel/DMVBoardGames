
export function generateLinkButton(config){
  return `
    <div class="raised ${config.class ?? ''}">
      <span class="shadow"></span>
      <span class="edge"></span>
      <span class="front">
        <a onclick="event.stopPropagation()" href=${config.url}>${config.text} </a>
      </span>   
    </div>
  `
}

export function generateDisabledButton(config){
  return `
    <button 
      class="disabled raised${config.class ? ` ${config.class}` : ``}"
      name="action"
      value="${config.text}"
      ${config.type ? `type=${config.type}` : ``}
    >  
      <span class="disabled-edge"></span>
      <span class="disabled-front" ${config.id ? `id="${config.id}"`: ``}>${config.text}</span>   
    </button>
  `
}

export function generateButton(config){
  return `
    <button 
      class="raised activeHover${config.class ? ` ${config.class}` : ``}"
      name="action"
      value="${config.text}"
      ${config.type ? `type=${config.type}` : ``}
    >  
      <span class="edge"></span>
      <span class="front" ${config.id ? `id="${config.id}"`: ``}>${config.text}</span>   
    </button>
  `
}
