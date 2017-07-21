import {Immutable, immutable} from "../../utilities/immutable_types"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {Actions, SynchronizeBattlePayload} from "../actions/battle_actions"

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
      { 
        let payload : JoinBattlePayload = action.payload;
        let battleId : string = payload.get("battleId");
        let user : string = payload.get("user");

        return state
          .set("battleId", battleId)
          .set("user", user);
      }

    case Actions.SYNCHRONIZE_BATTLE:
      {
        let payload : SynchronizeBattlePayload = action.payload;
        let version : number = payload.get("version");

        return state
          .set("version", version);
      }

    default:
      return state;
  }

};

export default updateBattleState;
