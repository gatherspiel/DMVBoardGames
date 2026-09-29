import { IS_LOGGED_IN_KEY, LOGIN_STORE } from "../../data/user/LoginStore.js";
import { PresentationComponent } from "/lib/places-js-latest.js";

export class UserActionsComponent extends HTMLElement {

	self;

	connectedCallback(){

		self = this;
		LOGIN_STORE.subscribeWithCallback(this.update);
	} 
	
	update(data){

		if(data?.isLoggedIn){
			self.innerHTML = `
				<div class="container-xl">
					<div> 
						<a class="btn secondary" href="$/htm/groups/create.html">Create group</a>
						<a class="btn secondary" href="/html/user/memberData.html">View my groups and events</a>
					</div>	
					<hr>
				</div>
			`;
		}
	}
}
