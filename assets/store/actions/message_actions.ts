import {Action, createAction} from "./actions"
import {MessageState} from "../reducers/message_reducers"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  MESSAGE = "message",
};

export type MessagePayload = Immutable<{
  message: MessageState
}>;

export function sendMessage(body: string, displayTime: number = 2000) : Action {
  let payload : MessagePayload = immutable({
    message: immutable({body, displayTime})
  });
  return createAction(Actions.MESSAGE, payload);
};
