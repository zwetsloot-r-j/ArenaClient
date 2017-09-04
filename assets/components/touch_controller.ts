import subscribe from "../utilities/subscriber"
import store from "../store/store"
import {toServer} from "../store/middleware/connection_middleware"
import {setStartPosition, updateMovement} from "../store/actions/movement_actions"
import {spawnProjectile, Projectiles} from "../store/actions/projectile_actions"
import {MovementState} from "../store/reducers/movement_reducers"
import {selectControlledMovementState} from "../store/selectors/movement_selectors"
import {selectBattlePlayer} from "../store/selectors/battle_selectors"
import {calculateCurrentPosition} from "./movement"
const {ccclass} = cc._decorator;

@ccclass
export default class TouchController extends cc.Component {

  onLoad() : void {
    this.node.on(
      cc.Node.EventType.TOUCH_END,
      (event) => this.fire(event),
    );
  }

  fire(event) : void {
    let playerId: string = selectBattlePlayer(store.getState());
    let controlledMovement: MovementState = selectControlledMovementState(store.getState());
    let {x, y} = calculateCurrentPosition(controlledMovement);
    let rotation = this.calculateRotation(controlledMovement, {x, y}, event.touch.getLocation());
    let temporaryMovementId = `${Date.now()}_${playerId}_${Math.floor(Math.random() * 10000)}`;

    store.dispatch(spawnProjectile(
      playerId,
      Projectiles.LaserBeam,
      temporaryMovementId,
    ));

    store.dispatch(setStartPosition(
      temporaryMovementId,
      rotation,
      x,
      y,
    ));

    let action = updateMovement(
      temporaryMovementId,
      null,
      600,
    );

    store.dispatch(action);
  }

  calculateRotation(controlledMovement: MovementState, origin: {x: number, y: number}, target: {x: number, y: number}) : number {
    if (target.x === origin.x && target.y === origin.y) {
      return controlledMovement.get("rotation");
    }

    if (target.x === origin.x && target.y > origin.y) {
      return 0;
    }

    if (target.x > origin.y && target.y === origin.y) {
      return 90;
    }

    if (target.x === origin.x && target.y < origin.y) {
      return 180;
    }

    if (target.x < origin.x && target.y === origin.y) {
      return 270;
    }

    let x = target.x - origin.x;
    let y = target.y - origin.y;

    if (x > 0 && y > 0) {
      let a = x;
      let b = y;
      return Math.atan(a / b) * 180 / Math.PI;
    }

    if (x > 0 && y < 0) {
      let a = x;
      let b = -y;
      return 180 - Math.atan(a / b) * 180 / Math.PI;
    }

    if (x < 0 && y < 0) {
      let a = -x;
      let b = -y;
      return 180 + Math.atan(a / b) * 180 / Math.PI;
    }

    let a = -x;
    let b = y;
    return 360 - Math.atan(a / b) * 180 / Math.PI;
  }

}
