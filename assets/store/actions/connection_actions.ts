import {Action, createAction} from "./actions"
import {createJoinAction, JoinActionPayload} from "../middleware/connection_middleware"

export enum Actions {
  CONNECT = "connect",
};

enum Channels {
  BATTLE_LOBBY = "battle:lobby",
  BATTLE = "battle:{id}",
};

export function joinLobby() : Action {
  let payload : JoinActionPayload = {channel: Channels.BATTLE_LOBBY};
  return createJoinAction(payload);
};

export function joinBattle(id: string, user: string) : Action {
  let payload : JoinActionPayload = {
    channel: Channels.BATTLE.replace("{id}", id),
    user: user,
  };
  return createJoinAction(payload);
};
