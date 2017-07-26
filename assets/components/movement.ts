import subscribe from "../utilities/subscriber"
import {selectMovementCollectionState} from "../store/selectors/movement_selectors"
import {MovementCollectionState, MovementState} from "../store/reducers/movement_reducers"
import {List} from "immutable"
import {Action} from "../store/actions/actions"
import {SetStartPositionPayload, UpdateMovementPayload} from "../store/actions/movement_actions"
const {ccclass} = cc._decorator;

@ccclass
export default class Movement extends cc.Component {

  private unsubscribe: () => void
  private acceleration: number
  private startX: number | null
  private startY: number | null

  onLoad() : void {
    this.acceleration = 0;
    this.startX = null;
    this.startY = null;
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
    if (this.startX === null) {
      this.startX = state.get("x");
      node.x = this.startX;
    }
    if (this.startY === null) {
      this.startY = state.get("y");
      node.y = this.startY;
    }
    node.rotation = state.get("rotation");
    this.acceleration = state.get("acceleration");

    let {x, y} = this.calculateCurrentPosition(state);
    node.x = x;
    node.y = y;
  }

  calculateCurrentPosition(state: MovementState) : {x: number, y: number} {
    let actionHistory : List<Action> = <List<Action>>state.get("actionHistory")
      .sort((action1, action2) => action1.gameTime <= action2.gameTime ? -1 : 1);

    return actionHistory.reduce((pos: {x: number, y: number}, prev: Action, index: number, collection: List<Action>) => {
      let payload : SetStartPositionPayload | UpdateMovementPayload = prev.payload;
      let x = payload.get("x");
      if (x === undefined) {
        x = pos.x;
      }

      let y = payload.get("y");
      if (y === undefined) {
        y = pos.y;
      }

      let next = collection.get(index + 1);
      if (next === undefined) {
        return {x, y};
      }

      let acceleration = (<UpdateMovementPayload>payload).get("acceleration");
      if (!acceleration) {
        return {x, y};
      }

      let startTime = prev.gameTime;
      let endTime = next.gameTime;
      let diff = endTime - startTime;
      if (!diff) {
        return {x, y};
      }

      let rotation = payload.get("rotation");
      let dt = diff / 1000;

      return this.calculateNextPosition({x, y}, dt, acceleration, rotation);

    }, {x: this.node.x, y: this.node.y});
  }

  update(dt: number) : void {
    let acceleration = this.acceleration;
    let rotation = this.node.rotation;
    let {x, y} = this.calculateNextPosition({x: this.node.x, y: this.node.y}, dt, acceleration, rotation);
    this.node.x = x;
    this.node.y = y;
   }

  calculateNextPosition({x, y}, dt: number, acceleration: number, rotation: number) {
    if (acceleration === 0) {
      return {x, y};
    }
    
    switch(rotation) {
      case 0:
        return {x, y: y + acceleration * dt};
      case 90:
        return {x: x + acceleration * dt, y};
      case 180:
        return {x, y: y - acceleration * dt};
      case 270:
        return {x: x - acceleration * dt, y};
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
      return {x: x + a, y: y + b};
    }

    if (rotation < 180) {
      return {x: x + b, y: y - a};
    }

    if (rotation < 270) {
      return {x: x - a, y: y - b};
    }

    return {x: x - b, y: y + b};
  }

}
