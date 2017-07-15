import {combineReducers} from "redux"
import player, {PlayerCollectionState} from "./player_reducers"
import connection, {ConnectionState} from "./connection_reducers"
import message, {MessageCollectionState} from "./message_reducers"

export type MainState = {
  player: PlayerCollectionState,
  connection: ConnectionState,
  message: MessageCollectionState,
};

export default combineReducers({
  player,
  connection,
  message,
});
