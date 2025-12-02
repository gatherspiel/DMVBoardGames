const SHOW_MORE_TEXT = "show more";
const SHOW_LESS_TEXT = "show less";

export class ShowMoreLessComponent extends HTMLElement {

  constructor() {
    super();
    this.addEventListener("click", this.updateDisplay)
  }

  updateDisplay(event){
    if(event.target.localName === "button"){
      if(this.buttonText === SHOW_MORE_TEXT){
        this.buttonText = SHOW_LESS_TEXT;
        this.innerHTML = this.#generateButton()+ this.lessPart + this.morePart;
      } else {
        this.buttonText = SHOW_MORE_TEXT;
        this.innerHTML = this.#generateButton() + this.lessPart;
      }
    }
  }




  connectedCallback() {
    let maxStartLines = this.getAttribute("max-start-lines");
    maxStartLines = maxStartLines ? parseInt(maxStartLines) : 3;

    const htmlSplit = this.innerHTML.split(/\r\n|\r|\n/);

    /*Do not show the show more/less button if the number of lines is less than the number max number of starting
    lines to display */
    if(htmlSplit.length <= maxStartLines){
      return;
    }

    this.buttonText = SHOW_MORE_TEXT;

    this.lessPart = htmlSplit.slice(0, maxStartLines).join("\n");
    this.morePart = htmlSplit.slice(maxStartLines).join("\n");

    this.innerHTML = this.lessPart + this.#generateButton();
  }

  #generateButton(){
    return `<button>${this.buttonText}</button>`
  }
}