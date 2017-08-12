import store from "../store"
import {selectBattlePlayer} from "../selectors/battle_selectors"
import {MainState} from "../reducers/main_reducer"
import {Action as ReduxAction, AnyAction} from "redux"
import {JoinActionPayload} from "../middleware/connection_middleware"
import {AddPlayerPayload} from "./player_actions"
import {Immutable, immutable} from "../../utilities/immutable_types"
import {Record} from "immutable"

let nextId = 0;

type Payload = Immutable<{}>
  | JoinActionPayload
  | AddPlayerPayload
  ;

type StandardAction = ReduxAction & {
  payload: Payload,
  clientId?: string,
  serverId?: string,
  gameTime?: number,
};

export type Action = StandardAction
  ;

export function createAction(type: string, payload: Payload = immutable({}), serverId = null, clientId = null) : Action {
  if (serverId !== null) {
    return imprintId({type, payload, serverId}, clientId);
  }
  return imprintId({type, payload}, clientId);
};

function imprintId(action: Action, clientId: string | null) {
  let user = selectBattlePlayer(<MainState>store.getState());
  action.gameTime = Date.now();
  if (clientId !== null) {
    action.clientId = clientId;
    return action;
  }
  if (user !== undefined && user !== "") {
    action.clientId = user + "_" + (nextId++);
  }
  return action;
};
