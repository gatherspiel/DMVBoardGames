import { LOGIN_STORE } from "../../data/user/LoginStore.js";
import { LOGOUT_STORE } from "../../data/user/LogoutStore.js";
import { DataStore,PresentationComponent } from "/lib/places-js-latest.js";
import { USER_DATA_STORE } from "../../data/user/UserDataStore.js";

const presentationSignals = {
	update: {

		imageFilePath: (state) => {
			if(state.isLoggedIn){
				return state.userData.imageFilePath;
			}
		},
		notLoggedIn: (state) =>{
			return state.isLoggedIn ? visible : hidden;
		},
		username: (state) => {
			return state;
		}
	}
}


async function retrieveData(){

	await LOGIN_STORE.fetchData();
	const loginState = LOGIN_STORE.getStoreData();

	if(loginState.isLoggedIn){

		await USER_DATA_STORE.fetchData();

		return { 
			isLoggedIn: true,
			userData: USER_DATA_STORE.getStoreDataa()
		}
	}

	return {
		isLoggedIn: false
	}
}


export const LOGIN_STATUS_STORE = DataStore.createWithCustomLoadSignal(
	{
		"loadAction": retrieveData,
		"presentationSignals": presentationSignals,
		"storeName": "login-status-store",
	
	}
)

	
