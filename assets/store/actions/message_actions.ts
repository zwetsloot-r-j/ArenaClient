import {Action, createAction} from "./actions"
import {MessageState} from "../reducers/message_reducers"

export enum Actions {
  MESSAGE = "message",
};

export type MessagePayload = {
  message: MessageState
};

export function sendMessage(body: string, displayTime: number = 2000) : Action {
  let payload : MessagePayload = {
    message: {body, displayTime}
  };
  return createAction(Actions.MESSAGE, payload);
};
