import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";

const CONFIRM_DELETE_BUTTON_ID = "confirm-delete-button";

import {DELETE_EVENT_STORE} from "/data/groups/DeleteEventStore.js";

export class DeleteEventComponent extends PresentationComponent {
  constructor() {
  
    super();

    const groupId = new URLSearchParams(document.location.search).get("groupId") ?? "";
		const eventId = new URLSearchParams(document.location.search).get("id") ?? "";

    const deleteEvent = ()=> { 
      const enteredName = this
        .getRootNode()
        .getElementById("event-name-input")
        ?.value.trim();
       
			const eventName = DELETE_EVENT_STORE.getStoreData().name;
			
      console.log(eventName+":"+enteredName);
      if (eventName !== enteredName) {
        DELETE_EVENT_STORE.updateStoreData({
          errorMessage: "Event name not entered correctly",
        });
      } else {
          
        const params = {
          method: "DELETE",
          url: `${API_ROOT}/groups/${encodeURIComponent(groupId)}/events/${encodeURIComponent(eventId)}`,
        };
        
        ApiLoadAction.getResponseData(params).then((response) => {
          if (response.errorMessage) {
            DELETE_EVENT_STORE.updateStoreData({
              errorMessage: response.errorMessage,
              "successMessage": "",
            });
          } else {
            DELETE_EVENT_STORE.updateStoreData({
                errorMessage: "",
                "successMessage": "Successfully deleted event",
              });
            }
          });
        }
      }

    this.setClickEvents({
      "deleteEvent":deleteEvent
    });
    this.setStore(DELETE_EVENT_STORE);
  }
 
}
