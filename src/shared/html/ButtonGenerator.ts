
export type LinkButtonConfig = {
  class?:string
  text: string
  url: string
}

export type ButtonConfig = {
  class?: string,
  id?:string,
  text:string,
  type?:string,
}

export function generateLinkButton(config:LinkButtonConfig){
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

export function generateDisabledButton(config:ButtonConfig){
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

export function generateButton(config:ButtonConfig){
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
