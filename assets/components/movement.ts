import subscribe from "../utilities/subscriber"
import store from "../store/store"
import {selectMovementCollectionState} from "../store/selectors/movement_selectors"
import {
  MovementCollectionState,
  MovementState,
  ActionHistoryMovementStatus,
  ActionHistoryBlock,
} from "../store/reducers/movement_reducers"
import {List} from "immutable"
import {Action} from "../store/actions/actions"
import {
  confirmSynchronizeMovement,
  recalculateMovementHistory,
  cacheMovementState,
  updateMovement,
  SyncMovementPayload,
  SetStartPositionPayload,
  UpdateMovementPayload,
} from "../store/actions/movement_actions"
import {toServer} from "../store/middleware/connection_middleware"
import {immutable} from "../utilities/immutable_types"
const {ccclass} = cc._decorator;

@ccclass
export default class Movement extends cc.Component {

  private unsubscribe: () => void
  private acceleration: number
  private startX: number | null
  private startY: number | null
  private version: number

  onLoad() : void {
    this.acceleration = 0;
    this.startX = null;
    this.startY = null;
    this.version = -1;
  }

  initialize(id: string) : void {
    this.unsubscribe = subscribe(selectMovementCollectionState, (state: MovementCollectionState) => { this.render(
      state.get("movements").get(id)
    ) });
  }

  changeId(id: string) : void {
    this.unsubscribe();
    this.initialize(id);
  }

  render(state: MovementState) : void {
    if (state === undefined) {
      return;
    }

    let lastActionHistory : ActionHistoryBlock = state.get("actionHistory").last();
    if (lastActionHistory.get("actions").count() === 0) {
      return;
    }

    let version = state.get("version");
    if (version > this.version) {
      this.version = version;
      store.dispatch(toServer(confirmSynchronizeMovement(state.get("movementId"), version)));
      if (!this.verifyLastActionHistoryState(state)) {
        return;
      };
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

    let {x, y} = calculateCurrentPosition(state);
    node.x = x;
    node.y = y;

    let movementStatus : ActionHistoryMovementStatus = immutable({
      x,
      y,
      rotation: state.get("rotation"),
      acceleration: state.get("acceleration"),
      externalForceX: state.get("externalForceX"),
      externalForceY: state.get("externalForceY"),
      gameTime: lastActionHistory
        .get("actions")
        .reduce((lastGameTime, {gameTime}) => Math.max(lastGameTime, gameTime), 0),
    });

    store.dispatch(cacheMovementState(state.get("movementId"), movementStatus));
  }

  verifyLastActionHistoryState(state: MovementState) : boolean {
    let lastActionHistory : ActionHistoryBlock = state
      .get("actionHistory")
      .last()
      ;

    let lastMovementStatus : ActionHistoryMovementStatus = lastActionHistory
      .get("status")
      ;

    if (!lastMovementStatus) {
      return true;
    }

    if (lastActionHistory.get("actions").some((action: Action) => action.gameTime < lastMovementStatus.get("gameTime"))) {
      store.dispatch(recalculateMovementHistory(state.get("movementId")));
      return false;
    }

    return true;
  }

  update(dt: number) : void {
    let acceleration = this.acceleration;
    let rotation = this.node.rotation;
    let {x, y} = calculateNextPosition({x: this.node.x, y: this.node.y}, dt, acceleration, rotation);
    this.node.x = x;
    this.node.y = y;
  }

  onDestroy() : void {
    this.unsubscribe();
  }

}

export const calculateCurrentPosition = (state: MovementState) : {x: number, y: number} => {
  let lastActionHistory : ActionHistoryBlock = state
    .get("actionHistory")
    .last()
    ;

  let lastMovementStatus : ActionHistoryMovementStatus = lastActionHistory
    .get("status")
    ;

  let actionHistory : List<Action> = <List<Action>>lastActionHistory
    .get("actions")
    .sort((action1, action2) => action1.gameTime <= action2.gameTime ? -1 : 1)
    ;

  let startX = lastMovementStatus ? lastMovementStatus.get("x") : state.get("x");
  let startY = lastMovementStatus ? lastMovementStatus.get("y") : state.get("y");
  if (lastMovementStatus) {
    let startMovement : Action = updateMovement(
      state.get("movementId"),
      lastMovementStatus.get("rotation"),
      lastMovementStatus.get("acceleration"),
    );
    startMovement.gameTime = lastMovementStatus.get("gameTime");
    actionHistory = actionHistory.unshift(startMovement);
  }

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

    return calculateNextPosition({x, y}, dt, acceleration, rotation);

  }, {x: startX, y: startY});
};

const calculateNextPosition = ({x, y}, dt: number, acceleration: number, rotation: number) => {
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
  let alpha = rotation % 90;
  let beta = 90 - alpha;
  let a = c * Math.sin(alpha / 180 * Math.PI);
  let b = c * Math.sin(beta / 180 * Math.PI);

  if (rotation < 90) {
    return {x: x + a, y: y + b};
  }

  if (rotation < 180) {
    return {x: x + b, y: y - a};
  }

  if (rotation < 270) {
    return {x: x - a, y: y - b};
  }

  return {x: x - b, y: y + a};
}

