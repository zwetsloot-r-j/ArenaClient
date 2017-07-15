import {addPlayer} from "../store/actions/player_actions"
import store from "../store/store"
const {ccclass} = cc._decorator;

@ccclass
export default class PlayerHandler extends cc.Component {

  onLoad() {
    store.dispatch(addPlayer({
      id: "1"
    }));
  }

}
