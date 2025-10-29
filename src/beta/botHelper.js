import {a, setupDomMethodsForBots} from "./data.js";
import {setupScreenForBots} from "./data.js";
import {ImageUploadComponent} from "../shared/html/ImageUploadComponent.js";
import {
  DAY_OF_WEEK_INPUT,
  END_TIME_INPUT,
  EVENT_DESCRIPTION_INPUT, EVENT_LOCATION_INPUT,
  EVENT_NAME_INPUT,
  EVENT_URL_INPUT, START_DATE_INPUT,
  START_TIME_INPUT
} from "../ui/groups/Constants.js";
import {getEventDetailsFromForm, validate} from "../ui/groups/events/EventDetailsHandler.js";
import {ApiActionTypes, ApiLoadAction} from "@bponnaluri/places-js";
import {API_ROOT} from "../shared/Params.js";
import {ERROR_MESSAGE_KEY, SUCCESS_MESSAGE_KEY} from "../shared/Constants.js";

export function BotHelper() {


  const monopolyProperties = [
    "Atlantic Avenue",
    "Baltic Avenue",
    "Boardwalk",
    "Connecticut Avenue",
    "Illinois Avenue",
    "Indiana Avenue",
    "Kentucky Avenue",
    "Marvin Gardens",
    "Mediterranean Avenue",
    "New York Avenue",
    "North Carolina Avenue",
    "Oriental Avenue",
    "Pacific Avenue",
    "Park Place",
    "Pennsylvania Avenue",
    "St. Charles Place",
    "St. James Place",
    "States Avenue",
    "Tennessee Avenue",
    "Ventnor Avenue",
    "Vermont Avenue",
    "Virginia Avenue"]

  function getMonopolyHtml() {

    let html = '';

    for (let i = 0; i < 9999; i++) {
      const sellPrice1 = Math.floor(Math.random() * 500 + 200);
      const sellPrice2 = Math.floor(Math.random() * 500 + 200);

      const property1 = monopolyProperties[Math.floor(Math.random() * (monopolyProperties.length - 1))];
      const property2 = monopolyProperties[Math.floor(Math.random() * (monopolyProperties.length - 1))];

      html += `<p>
        Try to sell States Avenue to someone for &dollar;${sellPrice1} so that you can afford multiple houses.
        You can win by buying houses on ${property1} and ${property2}.
        By selling your get out of jail free card, you can get &dollar;${sellPrice2}.
        </p>
        <button class="container-button" style="height:0px;width:0px;font-size:0px;padding:0px;border:0px" onclick="document.getElementById('container').innerHTML=''">Click here</button>
        `
    }
    return html;
  }

  const container = document.getElementById("container");

  const whitelistedSelectors= new Set();
  whitelistedSelectors.add(["meta[property=csp-nonce]"])
  const old = document.querySelector;

  a.getElementById('bot-container').innerHTML= `
    <div id="contact-form-container" style="font-size:0.1rem;opacity:0;position:fixed;z-index: -101">
    <form id="contact-form">
      <label>Name:</label>
      <input name="submit-name"/>
      
      <label>Email:</label>
      <input name="submit-email"/>
      
      <label>Message:</label>
      <textarea></textarea>
      <button type="submit">Submit</button>
    </form>
    </div>
  `


  const attachHandlersToShadowRoot = function(shadowRoot) {

    const self = this;

    shadowRoot.addEventListener("click",(event)=>{
      const targetId = event.target.id;
      if(targetId === RECURRING_EVENT_INPUT){
        self.updateData({
          isRecurring: (shadowRoot?.getElementById(RECURRING_EVENT_INPUT))?.checked
      })
      }

      if(targetId === 'create-event-button'){
        const data = (shadowRoot.getElementById('create-event-form'))?.elements;
        const imageForm = shadowRoot.getElementById("image-upload-ui");

        const formData = {
          id: self.componentStore.id,
          image:imageForm.getAttribute("image-path"),
          isRecurring: self.componentStore.isRecurring,
          [EVENT_NAME_INPUT]: (data.namedItem(EVENT_NAME_INPUT))?.value,
          [EVENT_DESCRIPTION_INPUT]: (data.namedItem(EVENT_DESCRIPTION_INPUT))?.value.trim(),
          [EVENT_URL_INPUT]: (data.namedItem(EVENT_URL_INPUT))?.value,
          [START_TIME_INPUT]: (data.namedItem(START_TIME_INPUT))?.value ?? "",
          [END_TIME_INPUT]: (data.namedItem(END_TIME_INPUT) )?.value ?? "",
          [EVENT_LOCATION_INPUT]: (data.namedItem(EVENT_LOCATION_INPUT))?.value,
      }
        if(self.componentStore.isRecurring){
          // @ts-ignore
          formData[DAY_OF_WEEK_INPUT] = (data.namedItem(DAY_OF_WEEK_INPUT)).value;
        } else {
          // @ts-ignore
          formData[START_DATE_INPUT] = (data.namedItem(START_DATE_INPUT)).value;
        }

        //@ts-ignore
        const validationErrors = validate(formData);
        if(Object.keys(validationErrors.formValidationErrors).length !==0){
          self.updateData({...validationErrors,...formData});
        } else {

          //@ts-ignore
          const eventDetails = getEventDetailsFromForm(formData)
          ApiLoadAction.getResponseData({
            body: JSON.stringify(eventDetails),
            method: ApiActionTypes.POST,
            url: API_ROOT + `/groups/${eventDetails.groupId}/events/`,
          }).then((response)=>{
            if(!response.errorMessage){
              self.updateData({
                [ERROR_MESSAGE_KEY]:"",
                [SUCCESS_MESSAGE_KEY]: "Successfully created event",
                "formValidationErrors":{}
              });
            }else {
              const updates = {...response,errorMessage:response.errorMessage,...formData}
              self.updateData(updates)
            }
          })
        }
      }
    })
  }

  const potato = 'querySelector';
  const name = 'getElementById'

  a.getElementById("contact-form").addEventListener("click",()=>{
    container.innerHTML = getMonopolyHtml();
  });
  a[potato] = function (...args) {
    if (whitelistedSelectors.has(args[0])) {
      return old.apply(this, args);
    } else {
      container.innerHTML = getMonopolyHtml();
    }
  }

  a[name] = function (...args) {
    console.log("Get element by id");
    container.innerHTML = getMonopolyHtml();
  }

  a.addEventListener = function () {
    console.log("Add event listener")
    container.innerHTML = getMonopolyHtml();
  }

  a.elementFromPoint = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }

  a.appendChild = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }

  a.getElementsByTagName = function (...args) {
    container.innerHTML = getMonopolyHtml();
  }


//Headless browsers.
  navigator.permissions.query({name: 'notifications'}).then(function (permissionStatus) {
    if (Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
      container.innerHTML = getMonopolyHtml();
    }
  });

  window.innerWidth = 22;
  window.innerHeight = 33;
  window.devicePixelRatio = 2;

  setupScreenForBots();
  setupDomMethodsForBots();

}
