import type { DefaultApiAction } from "../../../framework/reducer/api/DefaultApiAction.ts";
import type { BaseReducer } from "../../../framework/reducer/BaseReducer.ts";
import { generateApiReducerWithExternalClient } from "../../../framework/reducer/api/ApiReducerFactory.ts";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";

async function retrieveData(params: any, backupResponse: DefaultApiAction) {
  console.log(params);
  console.log(backupResponse);

  return;
}

const defaultResponse = {
  defaultFunction: () => {
    console.log("Hi");
  },
  defaultFunctionPriority: false,
};

export function getLoginComponentStoreFromLogoutResponse(): LoginComponentStore {
  return {
    isLoggedIn: true,
    email: "test",
  };
}

export const LOGOUT_REDUCER: BaseReducer = generateApiReducerWithExternalClient(
  retrieveData,
  defaultResponse,
);
