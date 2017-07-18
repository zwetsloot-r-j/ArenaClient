import {Action as ReduxAction, AnyAction} from "redux"
import {JoinActionPayload} from "../middleware/connection_middleware"
import {AddPlayerPayload} from "./player_actions"
import {Immutable, immutable} from "../../utilities/immutable_types"
import {Record} from "immutable"

type Payload = Immutable<{}>
  | JoinActionPayload
  | AddPlayerPayload
  ;

type StandardAction = ReduxAction & {
  payload: Payload
};

export type Action = StandardAction
  ;

export function createAction(type: string, payload: Payload = immutable({})) : Action {
  return {type, payload};
};
