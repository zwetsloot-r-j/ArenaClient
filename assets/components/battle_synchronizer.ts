import store from "../store/store"
import subscribe from "../utilities/subscriber"
import {confirmSynchronizeBattle} from "../store/actions/battle_actions"
import {toServer} from "../store/middleware/connection_middleware"
import {selectBattleVersion} from "../store/selectors/battle_selectors"
const {ccclass} = cc._decorator;

@ccclass
export default class BattleSynchronizer extends cc.Component {

  private unsubscribe: () => void

  onLoad() : void {
    this.unsubscribe = subscribe(selectBattleVersion, (version: number) => this.render(version));
  }

  render(version: number) : void {
    store.dispatch(toServer(confirmSynchronizeBattle(version)));
  }

}
