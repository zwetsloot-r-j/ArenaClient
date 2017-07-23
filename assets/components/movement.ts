import subscribe from "../utilities/subscriber"
import {selectMovementCollectionState} from "../store/selectors/movement_selectors"
import {MovementCollectionState, MovementState} from "../store/reducers/movement_reducers"
const {ccclass} = cc._decorator;

@ccclass
export default class Movement extends cc.Component {

  private unsubscribe: () => void
  private acceleration: number
  private startX: number
  private startY: number

  onLoad() : void {
    this.acceleration = 0;
    this.startX = 0;
    this.startY = 0;
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
    if (this.startX === 0) {
      this.startX = state.get("x");
      node.x = this.startX;
    }
    if (this.startY === 0) {
      this.startY = state.get("y");
      node.y = this.startY;
    }
    node.rotation = state.get("rotation");
    //TODO calculate movement with action history
    
    this.acceleration = state.get("acceleration");
  }

  update(dt: number) : void {
    let acceleration = this.acceleration;
    if (acceleration === 0) {
      return;
    }

    let rotation = this.node.rotation;
    
    switch(rotation) {
      case 0:
        this.node.y += acceleration * dt;
        return;
      case 90:
        this.node.x += acceleration * dt;
        return;
      case 180:
        this.node.y -= acceleration * dt;
        return;
      case 270:
        this.node.x -= acceleration * dt;
        return;
      default:
        break;
    }

    let c = acceleration * dt;
    let gamma = 90;
    let beta = rotation % 90;
    let alpha = 90 - beta;
    let a = c * Math.sin(alpha);
    let b = c * Math.sin(beta);

    if (rotation < 90) {
      this.node.x += a;
      this.node.y += b;
      return;
    }

    if (rotation < 180) {
      this.node.x += b;
      this.node.y -= a;
      return;
    }

    if (rotation < 270) {
      this.node.x -= a;
      this.node.y -= b;
      return;
    }

    this.node.x -= b;
    this.node.y += a;
  }

}
