import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {FighterCollectionState, FighterState} from "../reducers/fighter_reducers"

export function selectFighterCollectionState(state: MainState) : FighterCollectionState {
  return state.get("fighters");
};
