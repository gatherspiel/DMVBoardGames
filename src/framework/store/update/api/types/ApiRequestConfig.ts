import { ApiActionTypes } from "./ApiActionTypes.ts";
export type ApiRequestConfig = {
  url: string;
  method?: typeof ApiActionTypes;
  headers?: Record<string, string>;
  body?: any;
};
