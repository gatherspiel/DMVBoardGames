import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";

import {
  getGameTypeTagSelectHtml,
  getTagSelectedState,
} from "../../shared/html/SelectGenerator.js";

import { API_ROOT } from "/shared/Params.js";
import { CREATE_GROUP_STORE} from "/data/groups/CreateGroupStore.js";

export class CreateGroupComponent extends PresentationComponent {
  constructor() {
    
    super();
    
    const agreeRules = (e) =>{
      CREATE_GROUP_STORE.updateStoreData({
        "agreeRules" : e.eventData.target.checked,
      })
    }
 
    const createGroup = () =>{

      const data = CREATE_GROUP_STORE.getStoreData()
      if(!data.agreeRules){
        return;
      }

      const elements = this
        .getRootNode()
        .getElementById("create-group-form")?.elements; 

      const submitStatus ={
        "errorMessage":"",
        "successMessage":""
      };
          
      const requestBody =  
        JSON.stringify({
          name: groupName,
          description: groupDescription,
          image: this
            .querySelector("#image-upload-ui")
            .getAttribute("image-path"),
          url: elements.namedItem("group-url-input")?.value,
          gameTypeTags: Object.keys(getTagSelectedState(this.getRootNode())),
        });
 
        ApiLoadAction.getResponseData({
          body: requestBody,
          method: "POST",
          url: API_ROOT + `/groups/`,
        }).then((data) => {
          if (data.errorMessage) {
            submitStatus["errorMessage"]=data.errorMessage;
            this.updateStoreData(submitStatus);
          } else {
            submitStatus["successMessage"]=`Successfully created group. A site admin will review the group information before the group is visible on dmvboardgames.com.
            `;
            CREATE_GROUP_STORE.updateStoreDat(submitStatus);
        }
      });
    }

    this.setClickEvents({
      "agreeRules": agreeRules,
      "createGroup":createGroup
    });
    this.setStore(CREATE_GROUP_STORE);

  }
}
