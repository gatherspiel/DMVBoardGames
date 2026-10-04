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
		showIfLoggedIn: (state) =>{
			return state.isLoggedIn ? "" : "display:none";
		},
		username: (state) => {
			return state?.userData?.username;
		}
	}
}


async function retrieveData(){

	await LOGIN_STORE.fetchData();
	const loginState = LOGIN_STORE.getStoreData();

	if(loginState.isLoggedIn){

		const data = await USER_DATA_STORE.fetchData();

		if(data.status && data.status!== 200){
			console.error(`${data.status}: ${data.errorMessage}`);
		}
		else{
			return { 
				isLoggedIn: true,
				userData: USER_DATA_STORE.getStoreData()
			}
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

LOGIN_STATUS_STORE.fetchData();



const logOffSignals = {
	update: {
		showIfLoggedOff(data){

			const loginStatus = data.loginStatus.isLoggedIn;
			return loginStatus ? "display:none" : ""

		}
	}
}

export const LOGGED_OFF_STATUS_STORE = DataStore.createWithDataStoreSignals(
	{
		"storeSignals": [{
			"fieldName":"loginStatus",
			"store":LOGIN_STATUS_STORE
		}],
		"presentationSignals": logOffSignals,
		"storeName": "logged-off-status-store"	
	}
)



	
