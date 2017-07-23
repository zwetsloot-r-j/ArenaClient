import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {BattleState} from "../reducers/battle_reducers"

export function selectBattleState(state: MainState) : BattleState {
  return state.get("battle");
};

export const selectBattlePlayer : (state: MainState) => string =
  createSelector(
    selectBattleState,
    (state: BattleState) => state.get("user")
  );

export const selectBattleActionHistory : (State: MainState) => List<Action> =
  createSelector(
    selectBattleState,
    (state: BattleState) => state.get("actionHistory")
  );
