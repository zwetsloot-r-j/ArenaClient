import {connect, joinLobby} from "../store/actions/connection_actions"
import store from "../store/store"
const {ccclass} = cc._decorator;

@ccclass
export default class Connector extends cc.Component {

  onLoad() {
    store.dispatch(connect());
    store.dispatch(joinLobby());
  }

}
