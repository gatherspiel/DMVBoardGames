import {
  ApiLoadAction,
  BaseDynamicComponent,
} from "/lib/places-js-latest.js";
import {
  SUCCESS_MESSAGE_KEY,
  generateErrorMessage,
  generateSuccessMessage,
} from "../shared/html/StatusIndicators.js";

import { API_ROOT } from "./shared/Params.js";

const ENTER_NAME_INPUT_ID = "enter-name-input-id";
const ENTER_EMAIL_INPUT_ID = "enter-email-input-id";
const FEEDBACK_TEXT_INPUT_ID = "feedback-text-input-id";
const FEEDBACK_TYPE_INPUT_ID = "feedback-type-input-id";
const SUBMIT_FEEDBACK_ID = "submit-feedback-id";

export class FeedbackComponent extends BaseDynamicComponent {
  constructor() {
    super();

    const self = this;

    //getElementById is disabled.
    const rootNode = self.getRootNode();
    rootNode.findForm = rootNode.getElementById;

    this.addEventListener("click", (event) => {
      const targetId = event.target?.id;
      if (targetId === SUBMIT_FEEDBACK_ID) {
        const elements = rootNode.findForm(
          "submit-feedback-form",
        )?.elements;
        const feedbackText = elements.namedItem(FEEDBACK_TEXT_INPUT_ID)?.value;

        if (feedbackText && feedbackText.length > 10000) {
          self.updateData({
            errorMessage: "Feedback text cannot be more than 10000 characters",
          });
          return;
        }

        if (!feedbackText || feedbackText.length === 0) {
          self.updateData({
            errorMessage: "Feedback text cannot be blank",
          });
          return;
        }

        ApiLoadAction.getResponseData({
          body: JSON.stringify({
            email: elements.namedItem(ENTER_EMAIL_INPUT_ID)?.value,
            feedbackText: feedbackText,
            feedbackType: elements.namedItem(FEEDBACK_TYPE_INPUT_ID)?.value,
            name: elements.namedItem(ENTER_NAME_INPUT_ID)?.value,
          }),
          method: "POST",
          url: API_ROOT + "/feedback",
        }).then((data) => {
          if (data.errorMessage) {
            self.updateData({
              errorMessage: data.errorMessage,
              [SUCCESS_MESSAGE_KEY]: "",
            });
          } else {
            self.updateData({
              errorMessage: "",
              [SUCCESS_MESSAGE_KEY]: "Feedback submitted",
            });
          }
        });
      }
    });

  }

  connectedCallback() {
    this.updateData({
      checkedState: { general_feedback: "checked" },
      email: "",
      feedbackText: "",
      name: "",
    });
  }


  render(data) {
    return `
      <div class="container-xl"> 
        <h1>Share feedback</h1>
        <form id="submit-feedback-form" onsubmit="return false">  
          ${generateSuccessMessage(data?.[SUCCESS_MESSAGE_KEY])}
          ${generateErrorMessage(data?.errorMessage)}

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
              <input type="radio" name=${FEEDBACK_TYPE_INPUT_ID} value="general_feedback" ${data.checkedState?.["general_feedback"]}>
            </div>  
            <div>
              <label for="javascript">Bug report</label> 
              <input type="radio" name="${FEEDBACK_TYPE_INPUT_ID} value="bug_report" ${data?.checkedState?.["bug_report"]}>
            </div>  
            <div>
              <label>New feature</label>
              <input type="radio" name=${FEEDBACK_TYPE_INPUT_ID} value="new_feature" ${data?.checkedState?.["new_feature"]}>
            </div>  
            <div>
              <label>Feature enhancement</label>
              <input type="radio" name="${FEEDBACK_TYPE_INPUT_ID} value="feature_enhancement" ${data?.checkedState?.["feature_enhancement"]}>
            </div>
          </div>
          <button class="primary" id=${SUBMIT_FEEDBACK_ID} type="submit">Submit</button> 
        </form>
      </div>
    `;
  }
}
