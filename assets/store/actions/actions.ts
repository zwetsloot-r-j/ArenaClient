import {Action as ReduxAction} from "redux"
import {ConnectAction, ConnectActionPayload} from "../middleware/connection_middleware"
import {AddPlayerPayload} from "./player_actions"

type Payload = {}
  | ConnectActionPayload
  | AddPlayerPayload
  ;

type StandardAction = ReduxAction & {
  payload: Payload
};

export type Action = StandardAction
  | ConnectAction
  ;

export function createAction(type: string, payload: Payload = {}) : Action {
  return {type, payload};
};
