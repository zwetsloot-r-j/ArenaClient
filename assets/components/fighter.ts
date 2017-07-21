import subscribe from "../utilities/subscriber"
import {FighterState} from "../store/reducers/fighter_reducers"
const {ccclass} = cc._decorator;

@ccclass
export default class Fighter extends cc.Component {

  onLoad() : void {
    
  }

  initialize(state: FighterState) : void {
    this.node.color = cc.Color[(state.get("color").toUpperCase())];
    let movementComponent = this.node.getComponent("movement");
    movementComponent.initialize(state.get("movementId"));
  }

}
