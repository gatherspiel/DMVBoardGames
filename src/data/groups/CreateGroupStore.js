import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { LOGIN_STATUS_STORE } from "/data/user/LoginStatusStore.js";

const presentationSignals = {
	update: {
    displayStyle: (data)=>{
      if(!data?.loginStatus?.loggedIn){
        return "display:none"
      }
      return '';
    },
    submitErrorMessage: (data)=>{
      return data.submitErrorMessage;
    },
    notLoggedInMessage: (data)=>{
      if(!data.isLoggedIn){
        return "You must log in to create a group";
      }
      return '';
    },
    submitButtonClass:(data)=>{
      if(data.agreeRules){
        return "primary";
      }
      return "muted";
    },
    successMessage: (data)=>{
      return data.successMessage;
    },
    successMessageClass: (data)=>{
      if(data.successMessage){
        return "callout success";
      }
    }
	}
}
export const CREATE_GROUP_STORE = DataStore.createWithDataStoreSignals({
  "presentationSignals":presentationSignals, 
  "storeSignals":[{
    field:"loginStatus",
    store:LOGIN_STATUS_STORE
  }],  
  "storeName":"create-group-store"
});
