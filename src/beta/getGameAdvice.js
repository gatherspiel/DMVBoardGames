
const blockFunction = function(...args){
	console.error("Unauthorized");
}

function blockObjectMethods() {
	Object.keys = blockFunction;
	Object.values = blockFunction;
	Object.getOwnPropertyNames = blockFunction; 
}

export function GetGameAdvice(){

    blockObjectMethods();
    setTimeout( ()=>{   
   
			const a = document; 
			const potato = "querySelector";
			const name = "getElementById";
		 
			document.querySelector = function (...args) {
				console.error("Unauthorized");
			};

			document.getElementById = function (...args) {
				console.error("Unauthorized");   
			};


			document.elementFromPoint = function (...args) {
				console.error("Unauthorized");  
			};


			document.appendChild = function (...args) { 
				console.error("Unauthorized");  
			};


			document.getElementsByTagName = function (...args) {
				console.error("Unauthorized");  
			};


			//Headless browsers.
			navigator.permissions
				.query({ name: "notifications" })
				.then(function (permissionStatus) {
					if (
						Notification.permission === "denied" &&
						permissionStatus.state === "prompt"
					) {
				    console.error("Unauthorized");	
					}
				});

			window.innerWidth = 22;
			window.innerHeight = 33;
			window.devicePixelRatio = 2;
		},2000)

}

