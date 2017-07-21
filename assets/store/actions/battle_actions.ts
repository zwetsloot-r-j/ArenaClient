import {Action, createAction} from "./actions"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  JOIN_BATTLE = "join-battle", //server only for now
  SYNCHRONIZE_BATTLE = "sync-battle"
};

export type SynchronizeBattlePayload = Immutable<{
  version: number
}>;

export function synchronizeBattle(version: number) : Action {
  return createAction(Actions.SYNCHRONIZE_BATTLE, <SynchronizeBattlePayload>immutable({version}));
};
