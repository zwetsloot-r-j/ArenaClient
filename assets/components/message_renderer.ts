import subscribe from "../utilities/subscriber"
import {MainState} from "../store/reducers/main_reducer"
import {selectNextMessage} from "../store/selectors/message_selectors"
import {MessageState} from "../store/reducers/message_reducers"
import {List} from "immutable"
const {ccclass, property} = cc._decorator;

@ccclass
export default class MessageRenderer extends cc.Component {

  @property({
    default: null,
    type: cc.Prefab
  })
  private message: cc.Prefab
  private unsubscribe: () => void
  private timers: List<number>

  onLoad() : void {
    this.timers = List();
    this.unsubscribe = subscribe(selectNextMessage, (state: MessageState) => this.render(state));
  }

  render(nextMessage: MessageState) : void {
    if (nextMessage === undefined) {
      return;
    }

    let displayingMessages = List([ ...this.node.children ]);
    displayingMessages.forEach((child) => child.removeFromParent());

    let messageNode = cc.instantiate(this.message);
    let label = messageNode.getComponent(cc.Label);

    messageNode.opacity = 255 - 25 * this.node.children.length;
    label.string = nextMessage.get("body");
    this.node.addChild(messageNode);

    this.timers = this.timers.push(setTimeout(() => {
      messageNode.removeFromParent(); 
    }, nextMessage.get("displayTime")));

    displayingMessages.forEach((child) => {
      child.opacity = 255 - 25 * this.node.children.length;
      this.node.addChild(child);
    });
  }

  onExit() : void {
    this.unsubscribe();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = List();
  }

}
