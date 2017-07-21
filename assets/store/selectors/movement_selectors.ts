import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {MovementCollectionState, MovementState} from "../reducers/movement_reducers"

export function selectMovementCollectionState(state: MainState) : MovementCollectionState {
  return state.get("movements");
};
