import {DataStore} from "/lib/places-js-latest.js";

import {getDaysOfWeekSelect} from "/shared/html/SelectGenerator.js";

const groupName = new URLSearchParams(document.location.search).get("name");

export const EVENT_FORM_PRESENTATION_SIGNALS = {
    update: {
      "daysSelect":()=>{
        return getDaysOfWeekSelect();
      },
      "descriptionErrorMessage":(data)=>{
        return data?.formValidationErrors?.description;
      },
      "endTimeErrorMessage":(data)=>{
        return data?.formValidationErrors?.["end-time-input"];
      },
      "groupPageUrl":()=>{
        return `/html/groups/groups.html?name=${encodeURIComponent(groupName)}`;
      }, 
      "nameErrorMessage":(data)=>{
        return data?.formValidationErrors?.name;
      },
      "showSuccess":(data)=>{
        if(data.successMessage){
          return "visible";
        }
        return "hidden";
      },
      "startDateErrorMessage":(data)=>{
        return data?.formValidationErrors?.["start-date-input"];
      },
      "startTimeErrorMessage":(data)=>{
        return data?.formValidationErrors?.["start-time-input"];
      },
      "title":()=>{
        return `Add event for group ${groupName}`;
      }
    }
	};

export const CREATE_EVENT_STORE = DataStore.createWithInitialState({
  initialState:{},
  presentationSignals:EVENT_FORM_PRESENTATION_SIGNALS,
  storeName:"create-event-store"
});
