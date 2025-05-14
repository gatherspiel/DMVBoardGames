import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ExternalRequest } from "../../framework/api/ExternalRequest.js";
import type { DefaultResponse } from "../../framework/api/DefaultResponse.ts";
import { BaseStateUpdate } from "../../framework/api/BaseStateUpdate.ts";
import { AUTH_COMPONENT_STATE } from "./Constants.ts";
import { BaseAPI } from "../../framework/api/BaseAPI.ts";

const client: SupabaseClient = createClient(
  "https://karqyskuudnvfxohwkok.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
);

async function retrieveData(params: any, backupResponse: DefaultResponse) {
  console.log(params);
  console.log(typeof client);
  console.log(backupResponse);
}

function getAuthComponentStateFromResponse(response: any) {
  console.log(response);
  return {};
}

const defaultResponse = {
  defaultFunction: () => {
    return "Failed to authenticate";
  },
  defaultFunctionPriority: false,
};

export const authenticate: ExternalRequest = new ExternalRequest(
  retrieveData,
  defaultResponse,
);

export const updateData: BaseStateUpdate = new BaseStateUpdate(
  AUTH_COMPONENT_STATE,
  getAuthComponentStateFromResponse,
);

export const AUTH_API = new BaseAPI(authenticate, [updateData]);
