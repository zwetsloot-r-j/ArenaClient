import store from "../store/store"
import subscribe from "../utilities/subscriber"
import {synchronizeBattle} from "../store/actions/battle_actions"
import {toServer} from "../store/middleware/connection_middleware"
import {selectBattleState} from "../store/selectors/battle_selectors"
import {BattleState} from "../store/reducers/battle_reducers"
const {ccclass} = cc._decorator;

@ccclass
export default class BattleSynchronizer extends cc.Component {

  private battleId: string
  private unsubscribe: () => void

  onLoad() : void {
    this.battleId = "";
    this.unsubscribe = subscribe(selectBattleState, (state: BattleState) => this.render(state));
  }

  render(state: BattleState) : void {
    let battleId : string = state.get("battleId");

    if (this.battleId === battleId) {
      return;
    }

    let version : number = state.get("version");

    store.dispatch(toServer(synchronizeBattle(version)));
  }

}
