import store from "../store/store"
import {selectNextMessage} from "../store/selectors/message_selectors"
import {MessageState} from "../store/reducers/message_reducers"
const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageRenderer extends cc.Component {

  @property({
    default: null,
    type: cc.Prefab
  })
  private message: cc.Prefab
  private unsubscribe: () => void
  private timers: number[]

  onLoad() : void {
    this.timers = [];
    this.unsubscribe = store.subscribe(() => this.render());
  }

  render() : void {
    let nextMessage = selectNextMessage(store.getState());
    if (nextMessage === undefined) {
      return;
    }

    let displayingMessages = [ ...this.node.children ];
    displayingMessages.forEach((child) => child.removeFromParent());

    let messageNode = cc.instantiate(this.message);
    let label = messageNode.getComponent(cc.Label);

    messageNode.opacity = 255 - 25 * this.node.children.length;
    label.string = nextMessage.body;
    this.node.addChild(messageNode);

    this.timers = [ ...this.timers, setTimeout(() => {
      messageNode.removeFromParent(); 
    }, nextMessage.displayTime) ];

    displayingMessages.forEach((child) => {
      child.opacity = 255 - 25 * this.node.children.length;
      this.node.addChild(child);
    });
  }

  onExit() : void {
    this.unsubscribe();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }

}
