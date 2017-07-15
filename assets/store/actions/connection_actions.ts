import {Action, createAction} from "./actions"
import {createConnectAction, ConnectActionPayload} from "../middleware/connection_middleware"

const server = "ws://localhost:4000/socket";

export enum Actions {
  CONNECT = "connect",
};

enum Channels {
  BATTLE_LOBBY = "battle:lobby",
  BATTLE = "battle:{id}",
};

export function connect() : Action {
  return createAction(Actions.CONNECT);
};

export function joinLobby() : Action {
  let payload = <ConnectActionPayload>{channel: Channels.BATTLE_LOBBY};
  return createConnectAction(payload);
};

export function joinBattle(id: string) : Action {
  let payload = <ConnectActionPayload>{channel: Channels.BATTLE.replace("{id}", id)};
  return createConnectAction(payload);
};
