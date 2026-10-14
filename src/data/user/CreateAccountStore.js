import {LOGIN_STATUS_STORE} from "./LoginStatusStore.js";
import { DataStore,PresentationComponent } from "/lib/places-js-latest.js";

const presentationSignals = {
	update: {
    error: (data)=>{
			console.log(data);
      if(data.errorMessage){
				console.log("Hi");
        return data.errorMessage;
      }
      return '';
    },  
    successMessage: (data)=>{
      console.log(data);
      if(data.successMessage){
        return data.successMessage;
      }
      return '';
    },
		successStyle:(data)=>{
			if(data.successMessage){
				return "callout success";
			}
			return "";
		}
	}
}

export const CREATE_ACCOUNT_STORE = DataStore.createWithDataStoreSignals(
	{
		"storeSignals":[{
			"store":LOGIN_STATUS_STORE
			}], 
		"presentationSignals": presentationSignals,
		"storeName": "create-account-store",	
	}
)

