
import {DELETE_EVENT_REQUEST_STORE} from "../../Constants.ts";
import type {ApiRequestConfig} from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {getAccessTokenIfPresent} from "../../../auth/AuthUtils.ts";
import {AUTH_TOKEN_HEADER_KEY} from "../../../auth/Constants.ts";
import {ApiActionTypes} from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import {generateApiThunk} from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import {API_ROOT} from "../../../../shared/params.ts";

function updateDeleteEventRequestThunk(params: any): ApiRequestConfig {
    console.log("Params for deleting group:" + JSON.stringify(params));
    const url = `${API_ROOT}/groups/${params.groupId}/events/${encodeURIComponent(params.id)}/`

    let headers: Record<string, string> = {};
    const authData = getAccessTokenIfPresent();
    if (authData) {
        headers[AUTH_TOKEN_HEADER_KEY] = authData;
    }

    return {
        headers: headers,
        method: ApiActionTypes.DELETE,
        url: url,
    };
}

export const DELETE_EVENT_REQUEST_THUNK = generateApiThunk({
    queryConfig: updateDeleteEventRequestThunk,
    requestStoreName: DELETE_EVENT_REQUEST_STORE,
});
