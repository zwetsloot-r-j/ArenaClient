import {Action, createAction} from "./actions"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  SYNCHRONIZE_BATTLE = "synchronize-battle"
};

export type SynchronizeBattlePayload = Immutable<{
  version: number
}>;

export function synchronizeBattle(version: number) : Action {
  return createAction(Actions.SYNCHRONIZE_BATTLE, <SynchronizeBattlePayload>immutable({version}));
};
