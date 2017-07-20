import {addPlayer} from "../store/actions/player_actions"
import store from "../store/store"
import {immutable} from "../utilities/immutable_types"
const {ccclass} = cc._decorator;

@ccclass
export default class PlayerHandler extends cc.Component {

  onLoad() {
//    store.dispatch(addPlayer(immutable({
//      id: "1"
//    })));
  }

}
