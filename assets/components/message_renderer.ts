import store from "../store/store"
import {selectCurrentMessage} from "../store/selectors/message_selectors"
const {ccclass} = cc._decorator;

@ccclass
export default class MessageRenderer extends cc.Component {

  private label: cc.Label
  private unsubscribe: () => void

  onLoad() {
    this.label = this.node.getComponent(cc.Label);
    this.unsubscribe = store.subscribe(() => this.render());
  }

  render() {
    let currentMessage = selectCurrentMessage(store.getState());
    let text = currentMessage === undefined ? "" : currentMessage.body;
    this.label.string = text;
  }

  onExit() {
    this.unsubscribe();
  }

}
