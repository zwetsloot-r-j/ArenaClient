import {Action, createAction} from "./actions"
import {PlayerState} from "../reducers/player_reducers"

export enum Actions {
  ADD_PLAYER = "add-player"
};

export type AddPlayerPayload = {
  player: PlayerState
};

export function addPlayer(player: PlayerState) : Action {
  return createAction("add-player", <AddPlayerPayload>{player});
};
