import {Immutable, immutable} from "../../utilities/immutable_types"
import {createAction, Action} from "./actions"
import {ActionHistoryMovementStatus} from "../reducers/movement_reducers"

export enum Actions {
  CREATE_MOVEMENT = "create-movement",
  SYNC_MOVEMENT = "sync-movement",
  CONFIRM_SYNC_MOVEMENT = "confirm-sync-movement",
  SET_START_POSITION = "set-start-position",
  UPDATE_MOVEMENT = "update-movement",
  RECALCULATE_MOVEMENT_HISTORY = "recalculate-movement-history",
  CACHE_MOVEMENT_STATE = "cache-movement-state",
};

export type CreateMovementPayload = Immutable<{
  id: string,
}>;

export type SyncMovementPayload = Immutable<{
  id: string,
  version: number,
}>;

export type SetStartPositionPayload = Immutable<{
  movementId: string,
  rotation: number,
  x: number,
  y: number,
}>;

export type UpdateMovementPayload = Immutable<{
  movementId: string,
  rotation?: number,
  acceleration: number,
}>;

export type RecalculateMovementHistoryPayload = Immutable<{
  id: string,
}>;

export type CacheMovementStatePayload = Immutable<{
  id: string,
  movementStatus: ActionHistoryMovementStatus,
}>;

export function createMovement(id: string) : Action {
  return createAction(Actions.CREATE_MOVEMENT, <CreateMovementPayload>immutable({id}));
};

export function updateMovement(movementId: string, rotation: number | null, acceleration: number) : Action {
  let payload : UpdateMovementPayload = rotation === null
    ? immutable({movementId, acceleration})
    : immutable({movementId, rotation, acceleration});

  return createAction(Actions.UPDATE_MOVEMENT, payload);
};

export function confirmSynchronizeMovement(id: string, version: number) : Action {
  return createAction(Actions.CONFIRM_SYNC_MOVEMENT, <SyncMovementPayload>immutable({id, version}));
};

export function recalculateMovementHistory(id: string) : Action {
  return createAction(Actions.RECALCULATE_MOVEMENT_HISTORY, <RecalculateMovementHistoryPayload>immutable({id}));
};

export function cacheMovementState(id: string, movementStatus: ActionHistoryMovementStatus) : Action {
  return createAction(Actions.CACHE_MOVEMENT_STATE, <CacheMovementStatePayload>immutable({id, movementStatus}));
};
