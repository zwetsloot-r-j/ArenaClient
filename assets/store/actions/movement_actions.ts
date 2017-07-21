import {Immutable} from "../../utilities/immutable_types"

export enum Actions {
  CREATE_MOVEMENT = "create-movement",
  SYNC_MOVEMENT = "sync-movement",
  SET_START_POSITION = "set-start-position",
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

export function createMovement(id: string) : Action {
  return createAction(Actions.CREATE_MOVEMENT, <CreateMovementPayload>immutable({id}));
};
