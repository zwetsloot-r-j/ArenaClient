import {combineReducers} from "redux-immutable"
import * as Immutable from "immutable"
import players, {PlayerCollectionState} from "./player_reducers"
import connection, {ConnectionState} from "./connection_reducers"
import message, {MessageCollectionState} from "./message_reducers"
import battle, {BattleState} from "./battle_reducers"
import fighters, {FighterCollectionState} from "./fighter_reducers"
import movements, {MovementCollectionState} from "./movement_reducers"

export type MainState = Immutable.Map<string, any> & {
  players: PlayerCollectionState,
  connection: ConnectionState,
  message: MessageCollectionState,
  battle: BattleState,
  fighters: FighterCollectionState,
  movements: MovementCollectionState,
};

export default combineReducers({
  players,
  connection,
  message,
  battle,
  fighters,
  movements,
});
