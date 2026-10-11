import {PresentationComponent} from "/lib/places-js-latest.js";
import { getEventDetailsFromForm, validate } from "./EventDetailsHandler.js";
import { API_ROOT } from "/shared/Params.js";
import {CREATE_EVENT_STORE} from "/data/groups/CreateEventStore.js"

export class CreateEventComponent extends PresentationComponent{
  constructor(){
    super();

    const createEvent = ()=>{
      const data = self
          .getRootNode()
          .getElementById("create-event-form")?.elements;
      const imageForm = self.getRootNode().getElementById("image-upload-ui");
      const formData = {
        id: self.componentStore.id,
        image: imageForm.getAttribute("image-path"),
        isRecurring: self.componentStore.isRecurring,
        "event-name-input": data.namedItem("event-name-input")?.value,
        "event-description-input": data
          .namedItem("event-description-input")
          ?.value.trim(),
        "event-url-input": data.namedItem("event-url-input")?.value,
        "start-time-inpu": data.namedItem("start-time-input")?.value ?? "",
        "end-time-input": data.namedItem("end-time-input")?.value ?? "",
        "event-location-input": data.namedItem("event-location-input")?.value,
      };

      if (self.componentStore.isRecurring) {
        formData["day-of-week-input"] = data.namedItem("day-of-week-input").value;
      } else {
        formData["start-date-input"] = data.namedItem("start-date-input").value;
      }
      
      let validationErrors = {
        "nameErrorMessage":"",
        "descriptionErrorMessage":"",
        "startDateErrorMessage":"",
        "startTimeErrorMessage":"",
        "endTimeErrorMessage":"",
        "event-location-error-message":""
      }
      
      validationErrors = {...validationErrors,...validate(formData)};

      if (Object.keys(validationErrors.formValidationErrors).length !== 0) {
        CREATE_EVENT_STORE.updateStoreData(validationErrors);
      } else {
        const groupId = new URLSearchParams(document.location.search).get(
          "groupId",
        );
        const eventDetails = getEventDetailsFromForm(formData);
        ApiLoadAction.getResponseData({
          body: JSON.stringify(eventDetails),
          method: "POST",
          url: API_ROOT + `/groups/${groupId}/events/`,
        }).then((response) => {
          if (!response.errorMessage) {
            self.updateData({
              "errorMessage": "",
              "successMessage": "Successfully created event",
              formValidationErrors: {},
            });
          } else {
            const updates = {
              ...response,
              errorMessage: response.errorMessage,
              ...formData,
            };
            self.updateData(updates);
          }
        });
      }
    }

    this.setClickEvents({
      createEvent: createEvent
    });
    this.setStore(CREATE_EVENT_STORE);
  }
}

