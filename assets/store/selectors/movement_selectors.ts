import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {MovementCollectionState, MovementState} from "../reducers/movement_reducers"
import {selectControlledMovement} from "./controller_selectors"

export function selectMovementCollectionState(state: MainState) : MovementCollectionState {
  return state.get("movements");
};

export const selectControlledMovementState : (state: MainState) => MovementState =
  createSelector(
    selectMovementCollectionState,
    selectControlledMovement,
    (movementCollection: MovementCollectionState, movementId: string) => movementCollection.get("movements").get(movementId),
  );

