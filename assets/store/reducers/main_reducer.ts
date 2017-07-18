import {combineReducers} from "redux"
import players, {PlayerCollectionState} from "./player_reducers"
import connection, {ConnectionState} from "./connection_reducers"
import message, {MessageCollectionState} from "./message_reducers"
import battle, {BattleState} from "./battle_reducers"

export type MainState = {
  players: PlayerCollectionState,
  connection: ConnectionState,
  message: MessageCollectionState,
  battle: BattleState,
};

export default combineReducers({
  players,
  connection,
  message,
  battle,
});
