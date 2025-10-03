import {ApiActionTypes, ApiLoadAction, BaseDynamicComponent} from "@bponnaluri/places-js";
import {generateButton} from "../shared/html/ButtonGenerator.ts";
import {API_ROOT} from "../shared/Params.ts";
import {SUCCESS_MESSAGE_KEY} from "../shared/Constants.ts";
import {generateErrorMessage, generateSuccessMessage} from "../shared/html/StatusIndicators.ts";

const ENTER_NAME_INPUT_ID:string = "enter-name-input-id";
const ENTER_EMAIL_INPUT_ID:string = "enter-email-input-id";
const FEEDBACK_TEXT_INPUT_ID:string = "feedback-text-input-id";
const FEEDBACK_TYPE_INPUT_ID:string = "feedback-type-input-id"
const SUBMIT_FEEDBACK_ID:string = "submit-feedback-id";

export class FeedbackComponent extends BaseDynamicComponent {

  constructor() {
    super();
  }
  override getTemplateStyle():string {
    return `
      <link rel="stylesheet" type="text/css"  href="/styles/sharedHtmlAndComponentStyles.css"/>
      <style>
        .section-label {
          font-weight: 600;
        }
        
        #${ENTER_NAME_INPUT_ID},#${ENTER_EMAIL_INPUT_ID} {
          display: block;
          margin-top: 0.5rem;
        }
        
        
        
        #submit-feedback-form {
          padding-left: 1.5rem;
        }
        @media not screen and (width < 32em) {
          #feedback-type-select div {
            display: inline-block;
          }  
          #feedback-type-select  > :not(:first-child) {
            border-left: 1px solid black;
            padding-left: 0.25rem;
          } 
          #feedback-type-select input {
            padding-right: 0.25rem; 
          }  
          #${FEEDBACK_TEXT_INPUT_ID} {
            display: block;
            height: 10rem;
            width: 50rem;
          }
        }
        
        @media  screen and (width < 32em) {
          #feedback-type-select div {
            display: inline-block;
          }  
          #feedback-type-select  > :not(:first-child) {
            border-left: 1px solid black;
            padding-left: 0.25rem;
          } 
          #feedback-type-select input {
            padding-right: 0.25rem; 
          }  
          
          #${FEEDBACK_TEXT_INPUT_ID} {
            display: block;
            height: 10rem;
            width: 20rem;
          }
        }
      </style>
    `
  }

  connectedCallback(){
    this.updateData({
      checkedState:{"general_feedback":"checked"},
      email:'',
      feedbackText:'',
      name:'',
    })
  }

  override attachHandlersToShadowRoot(shadowRoot:ShadowRoot) {

    const self = this;

    shadowRoot?.addEventListener("click", (event: any) => {

      const targetId = event.target?.id;
      if (targetId === SUBMIT_FEEDBACK_ID) {

        const elements = (shadowRoot?.getElementById('submit-feedback-form') as HTMLFormElement)?.elements

        const feedbackText = (elements.namedItem(FEEDBACK_TEXT_INPUT_ID) as HTMLInputElement)?.value;
        if(feedbackText && feedbackText.length >10000){
          self.updateData({
            errorMessage:"Feedback text cannot be more than 10000 characters"
          })
          return;
        }
        if(!feedbackText || feedbackText.length === 0){
          self.updateData({
            errorMessage:"Feedback text cannot be blank"
          })
          return;
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify({
            email: (elements.namedItem(ENTER_EMAIL_INPUT_ID) as HTMLInputElement)?.value,
            feedbackText: feedbackText,
            feedbackType: (elements.namedItem(FEEDBACK_TYPE_INPUT_ID) as HTMLInputElement)?.value,
            name: (elements.namedItem(ENTER_NAME_INPUT_ID) as HTMLInputElement)?.value,
          }),
          method: ApiActionTypes.POST,
          url: API_ROOT + '/feedback'
        }).then((data:any)=>{
          if(data.errorMessage){
            self.updateData({
              errorMessage: data.errorMessage,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else{
            self.updateData({
              errorMessage: "",
              [SUCCESS_MESSAGE_KEY]: "Feedback submitted",
            });
          }
        })

      }
    })
  }

  render(data:any){
    return `

      <form id="submit-feedback-form" onsubmit="return false">  
        ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
        ${generateErrorMessage(data?.errorMessage)}
      <p>
        Use this form or email gulu@createthirdplaces.com to share feedback or submit a bug.
      </p>
      <label class="section-label">Feedback:</label>
      <textarea
        id=${FEEDBACK_TEXT_INPUT_ID}
        name=${FEEDBACK_TEXT_INPUT_ID}
        >${data.feedbackText}</textarea>
        
      <label class="section-label">(Optional)Enter name:</label>
      <input
        id=${ENTER_NAME_INPUT_ID}
        name=${ENTER_NAME_INPUT_ID}
        value="${data.name}"
      >
        
      <label class="section-label">(Optional)Enter email:</label>
      <input
        id=${ENTER_EMAIL_INPUT_ID}
        name=${ENTER_EMAIL_INPUT_ID}
        value=${data.email}
      >     
        
      <label class="section-label" id="feedback-type-label">Feedback type:</label>  
      <div id="feedback-type-select">
        <div>
        <label>General feedback</label> 
        <input type="radio" name=${FEEDBACK_TYPE_INPUT_ID} value="general_feedback" ${data.checkedState["general_feedback"]}>
        </div>
        
        <div>
        <label for="javascript">Bug report</label> 
        <input type="radio" name="${FEEDBACK_TYPE_INPUT_ID} value="bug_report" ${data.checkedState["bug_report"]}>
        </div>
        
        <div>
        <label>New feature</label>
        <input type="radio" name=${FEEDBACK_TYPE_INPUT_ID} value="new_feature" ${data.checkedState["new_feature"]}>
        </div>
        
        <div>
        <label>Feature enhancement</label>
        <input type="radio" name="${FEEDBACK_TYPE_INPUT_ID} value="feature_enhancement" ${data.checkedState["feature_enhancement"]}>
        </div>
      </div>
   
       ${generateButton({
          id: SUBMIT_FEEDBACK_ID,
          text: "Submit feedback",
          type:"submit",
        })}
        
      </form>
    </div>
    `
  }
}