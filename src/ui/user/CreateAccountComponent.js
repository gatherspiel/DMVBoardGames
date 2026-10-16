import { ApiLoadAction, PresentationComponent } from "/lib/places-js-latest.js";
import { API_ROOT } from "/shared/Params.js";

import { CREATE_ACCOUNT_STORE } from "/data/user/CreateAccountStore";
export class CreateAccountComponent extends PresentationComponent {
  constructor() {
    super();

    const createAccount = () => {
      const formData = {
        username: this.getRootNode().getElementById("username-input")?.value,
        password: this.getRootNode().getElementById("password-input")?.value,
        confirmPassword: this.getRootNode().getElementById(
          "confirm-password-input",
        )?.value,
      };
      if (
        !formData.username ||
        (!formData.password && !formData.confirmPassword)
      ) {
        CREATE_ACCOUNT_STORE.updateStoreData({
          errorMessage: "Enter a valid username and password",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        CREATE_ACCOUNT_STORE.updateStoreData({
          errorMessage: "Passwords must match",
        });
        return;
      }

      ApiLoadAction.getResponseData({
        body: JSON.stringify({
          email: formData.username,
          password: formData.password,
        }),
        method: "POST",
        url: API_ROOT + `/user/register`,
      }).then((response) => {
        if (response.errorMessage) {
          CREATE_ACCOUNT_STORE.updateStoreData({
            errorMessage: response.errorMessage,
            successMessage: "",
          });
        } else {
          CREATE_ACCOUNT_STORE.updateStoreData({
            successMessage: `Successfully created account. Check your email for a message to confirm and activate your account.`,
            errorMessage: "",
          });
        }
      });
    };

    this.setClickEvents({
      createAccount: createAccount,
    });
    this.setStore(CREATE_ACCOUNT_STORE);
  }
}
