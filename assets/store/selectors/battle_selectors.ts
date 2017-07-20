import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {BattleState} from "../reducers/battle_reducers"

export function selectBattleState(state: MainState) : BattleState {
  return state.get("battle");
};

