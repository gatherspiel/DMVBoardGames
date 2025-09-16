
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

export function generateButton(config:ButtonConfig){
  const buttonClasses = `raised activeHover${config.class ? ` ${config.class}` : ``}`;

  return `
    <button 
      class="${buttonClasses}"
      name="action"
      value="${config.text}"
      ${config.type ? `type=${config.type}` : ``}>
      
      <span class="shadow"></span>
       <span class="edge"></span>
       <span class="front" ${config.id ? `id="${config.id}"`: ``}>${config.text}</span>   
    </button>
  `
}
