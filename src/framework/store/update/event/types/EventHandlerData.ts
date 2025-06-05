export interface EventHandlerData {
  event?: Event;
  componentStore?: any;
  targetId: string;
  shadowRoot?: ShadowRoot;
}
