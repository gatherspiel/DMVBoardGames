import {ApiLoadAction, type ApiRequestConfig, BaseDynamicComponent, DataStore} from "@bponnaluri/places-js";
import {API_ROOT} from "../Params";

function getUserQueryConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + "/user",
  };
}

export class EditProfileComponent extends BaseDynamicComponent {

  constructor() {
    super([
      {
        dataStore: new DataStore(new ApiLoadAction(getUserQueryConfig)),
        componentReducer:(data:any)=>{
         console.log(data);
        }
    }]);
  }
  override getTemplateStyle():string {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      </style>
    `
  }


  render(data:any){
    console.log(data)
    return `
      <h1>Edit profile</h1>
   
        
      </form>
    </div>
    `
  }

}