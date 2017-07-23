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

export function createAction(type: string, payload: Payload = immutable({}), serverId = null) : Action {
  if (serverId !== null) {
    return imprintId({type, payload, serverId});
  }
  return imprintId({type, payload});
};

function imprintId(action: Action) {
  let user = selectBattlePlayer(<MainState>store.getState());
  if (user !== undefined && user !== "") {
    action.clientId = user + "_" + (nextId++);
  }
  action.gameTime = Date.now();
  return action;
};
