import {Immutable, immutable} from "../../utilities/immutable_types"
import {List} from "immutable"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {Actions, SynchronizeBattlePayload, ArchiveBattleActionPayload} from "../actions/battle_actions"

type JoinBattlePayload = Immutable<{
  battleId: string,
  user: string,
}>;

export type BattleState = Immutable<{
  battleId: string,
  user: string,
  version: number,
  actionHistory: List<Action>,
}>;

const initialState : BattleState = immutable({
  battleId: "",
  user: "",
  version: 0,
  actionHistory: List(),
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

    case Actions.ARCHIVE_BATTLE_ACTION:
      {
        let payload : ArchiveBattleActionPayload = action.payload;
        let archivableAction = payload.get("action");
        let actionHistory = state.get("actionHistory")
          .push(archivableAction)
          ;

        return state
          .set("actionHistory", actionHistory)
          ;
      }

    default:
      return state;
  }

};

export default updateBattleState;
