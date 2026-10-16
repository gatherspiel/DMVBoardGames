import {ApiLoadAction,PresentationComponent } from "/lib/places-js-latest.js";
import {FEEDBACK_STORE} from "/data/FeedbackStore.js"
import { API_ROOT } from "/shared/Params.js";

export class FeedbackComponent extends PresentationComponent {
  constructor() {
    super();

    const submitFeedback = ()=> {
      const elements = this.getRootNode().getElementById("submit-feedback-form")?.elements;
      const feedbackText = elements.namedItem("feedback-text-input-id")?.value;

      if (feedbackText && feedbackText.length > 10000) {
        FEEDBACK_STORE.updateStoreData({
          errorMessage: "Feedback text cannot be more than 10000 characters",
        });
        return;
      }

      if (!feedbackText || feedbackText.length === 0) {
        FEEDBACK_STORE.updateStoreData({
          errorMessage: "Feedback text cannot be blank",
        });
        return;
      }


      ApiLoadAction.getResponseData({
        body: JSON.stringify({
          email: elements.namedItem("enter-email-input-id")?.value,
          feedbackText: feedbackText,
          feedbackType: elements.namedItem("feedback-type")?.value,
          name: elements.namedItem("enter-name-input-id")?.value,
        }),
        method: "POST",
        url: API_ROOT + "/feedback",
      }).then((data) => {
        if (data.errorMessage) {
          FEEDBACK_STORE.updateStoreData({
            errorMessage: data.errorMessage,
            "successMessage": "",
          });
        } else {
          FEEDBACK_STORE.updateStoreData({
            errorMessage: "",
            "successMessage": "Feedback submitted",
          });
        }
      });
    };
   
    this.setClickEvents({
			"submitFeedback":submitFeedback
		});
		this.setStore(FEEDBACK_STORE);
  }

}
