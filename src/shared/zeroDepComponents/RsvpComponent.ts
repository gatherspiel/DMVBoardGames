
export class RsvpComponent extends HTMLElement {
  constructor() {
    super();
    console.log("Hi")
    this.addEventListener("click",this.updateRsvp)
  }

  updateRsvp(event:any){
    if(event.target.className == "front"){
      if(this.getAttribute('rsvp-status') !== "yes"){
        console.log("RSVP to event?");
      }else {
        console.log("Removing RSVP");
      }

      /*
        TODO
          -Make API call to rsvp or remove RSVP
          -If there is an error, show it on component.
          -If the RSVP is successful, show message and update RSVP count and re-render component.
       */
    }
    console.log(event.target);
  }

  connectedCallback(){

    const rsvpCount = this.getAttribute('rsvp-count') ?? null

    let rsvpStr = ``;
    if(rsvpCount && rsvpCount !== "0"){
      rsvpStr = rsvpCount === '1' ?
        `1 RSVP` :
        `${rsvpCount} RSVPs`
    }

    const rsvpButtonText = this.getAttribute('rsvp-status') === "yes" ? "Cancel RSVP" : "RSVP";
    this.innerHTML = `
      <button 
        class="raised activeHover"
      >  
        <span class="edge"></span>
        <span class="front">${rsvpButtonText}</span>   
      </button>
      
      <p>${rsvpStr}</p>
    `
  }

}