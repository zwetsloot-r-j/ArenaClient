import {Reducer, AnyAction} from "redux"

enum Actions {
  JOIN_BATTLE = "join-battle",
};

type JoinBattlePayload = {
  battleId: string,
  user: string,
};

export type BattleState = {
  battleId: string,
  user: string,
};

const initialState : BattleState = {
  battleId: "",
  user: "",
};

const updateBattleState : Reducer<BattleState> = function(
  state: BattleState = initialState,
  action: AnyAction
) : BattleState {

  switch(action.type) {

    case Actions.JOIN_BATTLE:
      let payload : JoinBattlePayload = action.payload;
      let {battleId, user} = payload;

      return { ...state,
        battleId,
        user,
      };

    default:
      return state;
  }

};

export default updateBattleState;
