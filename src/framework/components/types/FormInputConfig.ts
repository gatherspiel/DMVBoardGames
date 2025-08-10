import {COMPONENT_LABEL_KEY} from "../../../shared/Constants.ts";

export type FormInputConfig = {
  [COMPONENT_LABEL_KEY]: string,
  id: string,
  value?: string, //If the value is undefined, a previous input value will be used if it is present.
  inputType: string,
  className?:string,
  lineBreakAfterLabel?: boolean,
}