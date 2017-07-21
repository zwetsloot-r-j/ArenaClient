import subscribe from "../utilities/subscriber"
import {selectMovementCollectionState} from "../store/selectors/movement_selectors"
import {MovementCollectionState, MovementState} from "../store/reducers/movement_reducers"
const {ccclass} = cc._decorator;

@ccclass
export default class Movement extends cc.Component {

  private unsubscribe: () => void

  onLoad() : void {

  }

  initialize(id: string) : void {
    this.unsubscribe = subscribe(selectMovementCollectionState, (state: MovementCollectionState) => { this.render(
      state.get("movements").get(id)
    ) });
  }

  render(state: MovementState) : void {
    if (state === undefined) {
      return;
    }
    let node = this.node;
    node.x = state.get("x");
    node.y = state.get("y");
    node.rotation = state.get("rotation");
    //TODO calculate movement
  }

}
