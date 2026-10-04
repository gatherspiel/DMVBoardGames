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
    
    const agreeRulesEvent = (e) =>{
      self.updateStoreData({
        "agree-rules-id" : e.target.checked,
      })
    }

    
    const createGroupEvent = () =>{
      const elements = this
        .getRootNode()
        .getElementById("create-group-form")?.elements; 

      const submitStatus ={
        "groupDescriptionErrorMessage":"",
        "groupNameErrorMessage":"",
        "submitErrorMessage":"",
        "submitSuccessMessage":""
      };
           
      const groupName = elements.namedItem("group-name-input")?.value;
      if (!groupName || groupName.length === 0) {
        submitStatus["groupNameErrorMessage"] = "Name is a required field";
      }
 
      const groupDescription = elements.namedItem("group-description-input")?.value;
      if (!groupDescription || groupDescription.length === 0) {
        submitStatus["groupDescriptionErrorMessage"] = "Description is a required field";
      }
      
      const requestBody =  
        JSON.stringify({
          id: self.componentStore.id,
          name: groupName,
          description: groupDescription,
          image: self
            .getRootNode()
            .getElementById("image-upload-ui")
            .getAttribute("image-path"),
          url: elements.namedItem("group-url-input")?.value,
          gameTypeTags: Object.keys(getTagSelectedState(self.getRootNode())),
        });

        
        ApiLoadAction.getResponseData({
          body: requestBody,
          method: "POST",
          url: API_ROOT + `/groups/`,
        }).then((data) => {
          if (data.errorMessage) {
            submitStatus["submitErrorMessage"]=data.errorMessage;
            self.updateStoreData(submitStatus);
          } else {
            submitStatus["successMessage"]=`
              Successfully created group. A site admin will review the group information before the group is visible on
    dmvboardgames.com. Email gulu@createthirdplaces.org if you have any questions or comments.           
            `;
            self.updateStoreData(submitStatus);
        }
      });
    }

    this.setClickEvents({
      "agreeRulesEvent": agreeRulesEvent,
      "createGroupEvent":createGroupEvent
    });
    this.setStore(CREATE_GROUP_STORE);

  }
}
