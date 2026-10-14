import {DataStore} from "/lib/places-js-latest.js";

import { convertTimeTo24Hours} from "/shared/EventDataUtils.js"
import {getDaysOfWeekSelect} from "/shared/html/SelectGenerator.js";

const groupName = new URLSearchParams(document.location.search).get("name");

import {EVENT_STORE} from "/data/groups/events/EventStore.js"

export const EDIT_EVENT_STORE = DataStore.createWithDataStoreSignals({
  storeSignals:[{
    "store":EVENT_STORE
  }],
  presentationSignals:{

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
			"isOneTime":(data)=>{
				console.log(data.isRecurring);
				return data.isRecurring ? "none" : "visible";
			},
			"isRecurring":(data)=>{
				return data.isRecurring ? "visible" : "none";
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
			"startTime":(data)=>{
				return convertTimeTo24Hours(data.startTime);
			},
			"endTime":(data)=>{
				return convertTimeTo24Hours(data.endTime);
			},
      "startTimeErrorMessage":(data)=>{
        return data?.formValidationErrors?.["start-time-input"];
      },
      "title":()=>{
        return `Add event for group ${groupName}`;
      }
    }
  },
  storeName:"create-event-store"
});
