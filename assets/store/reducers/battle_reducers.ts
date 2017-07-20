import {Immutable, immutable} from "../../utilities/immutable_types"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"

enum Actions {
  JOIN_BATTLE = "join-battle",
};

type JoinBattlePayload = Immutable<{
  battleId: string,
  user: string,
}>;

export type BattleState = Immutable<{
  battleId: string,
  user: string,
  version: number,
}>;

const initialState : BattleState = immutable({
  battleId: "",
  user: "",
  version: 0,
});

const updateBattleState : Reducer<BattleState> = function(
  state: BattleState = initialState,
  action: Action
) : BattleState {

  switch(action.type) {

    case Actions.JOIN_BATTLE:
      let payload : JoinBattlePayload = action.payload;
      let battleId : string = payload.get("battleId");
      let user : string = payload.get("user");

      return state
        .set("battleId", battleId)
        .set("user", user);

    default:
      return state;
  }

};

export default updateBattleState;
