import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {ControllerState} from "../reducers/controller_reducers"

export function selectControllerState(state: MainState) : ControllerState {
  return state.get("controller");
};

export const selectControlledMovement : (state: MainState) => string =
  createSelector(
    selectControllerState,
    (state: ControllerState) => state.get("controlledMovementId")
  );
