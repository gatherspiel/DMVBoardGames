import { LOGIN_STORE } from "../../data/user/LoginStore.js";
import { PresentationComponent } from "/lib/places-js-latest.js";


export class LoginComponent extends PresentationComponent {
  constructor() {
		super();

		const loginHandler = () => {
		 const formInputs = this.retrieveAndValidateFormInputs();
		 console.log(formInputs);
			
			try {
				if (formInputs.errorMessage) {
					LOGIN_STORE.updateStoreData({
						loginError:formInputs.errorMessage
					})
				} else {
					LOGIN_STORE.fetchData({
						formInputs,
					}).then((response)=>{
            console.log("Login succeeded");
					});
				}
			} catch(e){
				console.error(e);
			}
		}


		this.setClickEvents({
			"login":loginHandler

		});

		this.setStore(LOGIN_STORE);
  }

  retrieveAndValidateFormInputs() {
		console.log(document.getElementById("username-input"));
    const username = document.getElementById("username-input")?.value;
    const password = document.getElementById("password-input")?.value;
		if (!username || !password) {
      return {
        errorMessage: "Enter a valid username and password",
      };
    }
    return {
      username: username,
      password: password,
    };
  }

}
