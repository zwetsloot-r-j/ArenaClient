import {Immutable, immutable} from "../../utilities/immutable_types"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {Actions} from "../actions/fighter_actions"

export type FighterState = Immutable<{
  id: string,
  color: string,
  playerId: string,
  movementId: string,
}>;

export type FighterCollectionState = Immutable<{
  fighterCount: number,
  fighters: Immutable<{[id: string]: FighterState}>
}>;

const initialState : FighterCollectionState = immutable({
  fighterCount: 0,
  fighters: immutable({})
});

const updateFighterState : Reducer<FighterCollectionState> = function(
  state: FighterCollectionState = initialState,
  action: Action
) : FighterCollectionState {

  switch(action.type) {

    case Actions.ADD_FIGHTER:
      {
        let fighter : FighterState = action.payload;
        let playerId = fighter.get("playerId");
        let fighterCount = state.get("fighterCount");
        let fighters = state.get("fighters")
          .set(playerId, fighter);

        return state
          .set("fighterCount", fighterCount + 1)
          .set("fighters", fighters)
          ;

      }

    default:
      return state;
  }

};

export default updateFighterState;
