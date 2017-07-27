import {Action, createAction} from "./actions"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  JOIN_BATTLE = "join-battle", //server only for now
  SYNCHRONIZE_BATTLE = "sync-battle",
  CONFIRM_SYNCHRONIZE_BATTLE = "confirm-sync-battle",
  ARCHIVE_BATTLE_ACTION = "archive-battle-action",
};

export type SynchronizeBattlePayload = Immutable<{
  version: number
}>;

export type ArchiveBattleActionPayload = Immutable<{
  action: Action
}>;

export function synchronizeBattle(version: number) : Action {
  return createAction(Actions.SYNCHRONIZE_BATTLE, <SynchronizeBattlePayload>immutable({version}));
};

export function confirmSynchronizeBattle(version: number) : Action {
  return createAction(Actions.CONFIRM_SYNCHRONIZE_BATTLE, <SynchronizeBattlePayload>immutable({version}));
};

export function archiveBattleAction(action: Action) : Action {
  return createAction(Actions.ARCHIVE_BATTLE_ACTION, <ArchiveBattleActionPayload>immutable({action}));
};
