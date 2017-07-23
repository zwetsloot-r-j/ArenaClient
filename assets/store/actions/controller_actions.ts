import {Action, createAction} from "./actions"
import {Immutable, immutable} from "../../utilities/immutable_types"

export enum Actions {
  SET_CONTROLLED_MOVEMENT = "set-controlled-movement",
  PRESS_X_AXIS_KEY = "press-x-axis-key",
  PRESS_Y_AXIS_KEY = "press-y-axis-key",
  PRESS_FIRE_KEY = "press-fire-key",
  RELEASE_X_AXIS_KEY = "release-x-axis-key",
  RELEASE_Y_AXIS_KEY = "release-y-axis-key",
  RELEASE_FIRE_KEY = "release-fire-key",
};

export type SetControlledMovementPayload = Immutable<{
  movementId: string
}>;

export function setControlledMovement(movementId: string) : Action {
  return createAction(Actions.SET_CONTROLLED_MOVEMENT, <SetControlledMovementPayload>immutable({movementId}));
};

export type PressAxisKeyPayload = Immutable<{
  key: number
}>;

export function pressXAxisKey(key: number) : Action {
  return createAction(Actions.PRESS_X_AXIS_KEY, <PressAxisKeyPayload>immutable({key}));
};

export function pressYAxisKey(key: number) : Action {
  return createAction(Actions.PRESS_Y_AXIS_KEY, <PressAxisKeyPayload>immutable({key}));
};

export function pressFireKey() : Action {
  return createAction(Actions.PRESS_FIRE_KEY);
};

export function releaseXAxisKey(key: number) : Action {
  return createAction(Actions.RELEASE_X_AXIS_KEY, <PressAxisKeyPayload>immutable({key}));
};

export function releaseYAxisKey(key: number) : Action {
  return createAction(Actions.RELEASE_Y_AXIS_KEY, <PressAxisKeyPayload>immutable({key}));
};

export function releaseFireKey() : Action {
  return createAction(Actions.RELEASE_FIRE_KEY);
};
