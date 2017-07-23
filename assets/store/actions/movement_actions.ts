import {Immutable, immutable} from "../../utilities/immutable_types"
import {createAction, Action} from "./actions"

export enum Actions {
  CREATE_MOVEMENT = "create-movement",
  SYNC_MOVEMENT = "sync-movement",
  SET_START_POSITION = "set-start-position",
  UPDATE_MOVEMENT = "update-movement",
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

export function createMovement(id: string) : Action {
  return createAction(Actions.CREATE_MOVEMENT, <CreateMovementPayload>immutable({id}));
};

export function updateMovement(movementId: string, rotation: number | null, acceleration: number) : Action {
  let payload : UpdateMovementPayload = rotation === null
    ? immutable({movementId, acceleration})
    : immutable({movementId, rotation, acceleration});

  return createAction(Actions.UPDATE_MOVEMENT, payload);
};
