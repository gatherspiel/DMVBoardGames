import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";
import { getEventDetailsFromForm, validate } from "./EventDetailsHandler.js";
import { API_ROOT } from "/shared/Params.js";
import { CREATE_EVENT_STORE } from "/data/groups/events/CreateEventStore.js";

export class CreateEventComponent extends PresentationComponent {
  constructor() {
    super();

    const id = new URLSearchParams(document.location.search).get("id");

    const createEvent = () => {
      const data =
        this.getRootNode().getElementById("create-event-form")?.elements;
      const imageForm = this.getRootNode().getElementById("image-upload-ui");
      const formData = {
        id: id,
        image: imageForm.getAttribute("image-path"),
        isRecurring: this.getRootNode().getElementById("recurring-event-input")
          .checked,
        name: data.namedItem("event-name-input")?.value,
        description: data.namedItem("event-description-input")?.value.trim(),
        "event-url-input": data.namedItem("event-url-input")?.value,
        "start-time-input": data.namedItem("start-time-input")?.value ?? "",
        "end-time-input": data.namedItem("end-time-input")?.value ?? "",
        location: data.namedItem("event-location-input")?.value,
      };

      if (formData.isRecurring) {
        const day = data.namedItem("day-of-week-input").querySelector("input");
        formData["day-of-week"] = day.name;
      } else {
        formData["start-date-input"] = data.namedItem("start-date-input").value;
      }

      let validationErrors = {
        name: "",
        description: "",
        startDateErrorMessage: "",
        startTimeErrorMessage: "",
        endTimeErrorMessage: "",
        "event-location-error-message": "",
      };

      validationErrors = { ...validationErrors, ...validate(formData) };

      let hasErrors = false;
      Object.values(validationErrors).forEach((item) => {
        if (item.length > 0) {
          hasErrors = true;
        }
      });

      if (hasErrors) {
        console.log("Errors");
        CREATE_EVENT_STORE.updateStoreData({
          formValidationErrors: validationErrors,
        });
      } else {
        const groupId = new URLSearchParams(document.location.search).get(
          "groupId",
        );
        const eventDetails = getEventDetailsFromForm(formData);
        ApiLoadAction.getResponseData({
          body: JSON.stringify(eventDetails),
          method: "POST",
          url: API_ROOT + `/groups/${id}/events/`,
        }).then((response) => {
          if (!response.errorMessage) {
            CREATE_EVENT_STORE.updateStoreData({
              errorMessage: "",
              successMessage: "Successfully created event",
              formValidationErrors: validationErrors,
            });
          } else {
            CREATE_EVENT_STORE.updateStoreData({
              errorMessage: response.errorMessage,
              successMessage: "",
              formValidationErrors: validationErrors,
            });
          }
        });
      }
    };

    this.setClickEvents({
      createEvent: createEvent,
    });
    this.setStore(CREATE_EVENT_STORE);
  }
}
