import {Action, createAction} from "./actions"
import {PlayerState} from "../reducers/player_reducers"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  ADD_PLAYER = "add-player"
};

export type AddPlayerPayload = Immutable<{
  player: PlayerState
}>;

export function addPlayer(player: PlayerState) : Action {
  return createAction("add-player", <AddPlayerPayload>immutable({player}));
};
