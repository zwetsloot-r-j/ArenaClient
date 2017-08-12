import subscribe from "../utilities/subscriber"
import store from "../store/store"
import {toServer} from "../store/middleware/connection_middleware"
import {List} from "immutable"
import {
  pressXAxisKey,
  pressYAxisKey,
  pressFireKey,
  releaseXAxisKey,
  releaseYAxisKey,
  releaseFireKey,
} from "../store/actions/controller_actions"
import {updateMovement} from "../store/actions/movement_actions"
import {selectControllerState, selectControlledMovement} from "../store/selectors/controller_selectors"
import {ControllerState} from "../store/reducers/controller_reducers"
const {ccclass} = cc._decorator;

const KEY_MAP = {
  UP: cc.KEY.w,
  DOWN: cc.KEY.s,
  RIGHT: cc.KEY.a,
  LEFT: cc.KEY.d,
  FIRE: cc.KEY.space,
};

const PRESS_ACTIONS_BY_KEY = {
  [KEY_MAP.UP]: pressYAxisKey,
  [KEY_MAP.DOWN]: pressYAxisKey,
  [KEY_MAP.LEFT]: pressXAxisKey,
  [KEY_MAP.RIGHT]: pressXAxisKey,
  [KEY_MAP.FIRE]: pressFireKey
};

const RELEASE_ACTIONS_BY_KEY = {
  [KEY_MAP.UP]: releaseYAxisKey,
  [KEY_MAP.DOWN]: releaseYAxisKey,
  [KEY_MAP.LEFT]: releaseXAxisKey,
  [KEY_MAP.RIGHT]: releaseXAxisKey,
  [KEY_MAP.FIRE]: releaseFireKey
};

const ROTATION_MAP = [
  [
    null,
    0,
    180
  ],
  [
    90,
    45,
    135
  ],
  [
    270,
    315,
    225
  ]
];

@ccclass
export default class Controller extends cc.Component {

  private controlledMovementId: string
  private unsubscribeUpdateControlledMovement: () => void
  private unsubscribe: () => void
  private ignorePressed: number[]

  onLoad() : void {
    this.unsubscribeUpdateControlledMovement = subscribe(
      selectControlledMovement,
      (controlledMovement : string) => this.updateControlledMovement(controlledMovement)
    );

    this.unsubscribe = subscribe(
      selectControllerState,
      (controllerState: ControllerState) => this.render(controllerState)
    );

    this.ignorePressed = [];
    this.initializeControls();
  }

  updateControlledMovement(controlledMovement: string) : void {
    this.controlledMovementId = controlledMovement;
  }

  render(controllerState: ControllerState) : void {
    if (this.controlledMovementId === undefined || this.controlledMovementId === "") {
      return; 
    }

    let startTime = Date.now();

    let xIndex = this.getXRotationMapIndex(controllerState.get("xAxisButtonsPressed"));
    let yIndex = this.getYRotationMapIndex(controllerState.get("yAxisButtonsPressed"));
    let rotation = ROTATION_MAP[xIndex][yIndex];
    let acceleration = this.getAcceleration(
      controllerState.get("xAxisButtonsPressed"),
      controllerState.get("yAxisButtonsPressed")
    );

    let updateMovementAction = updateMovement(this.controlledMovementId, rotation, acceleration);
    store.dispatch(toServer(updateMovementAction));
    store.dispatch(updateMovementAction);
  }

  initializeControls() : void {
    cc.eventManager.addListener({

      event: cc.EventListener.KEYBOARD,

      onKeyPressed: (keycode, event) => {
        if (this.controlledMovementId === undefined || this.controlledMovementId === "") {
          return;
        }

        if (~this.ignorePressed.indexOf(keycode)) {
          return;
        }
        this.ignorePressed.push(keycode);

        let action = PRESS_ACTIONS_BY_KEY[keycode];
        if (action === undefined) {
          return;
        }

        store.dispatch(action(keycode));
      },

      onKeyReleased: (keycode, event) => {
        if (this.controlledMovementId === undefined || this.controlledMovementId === "") {
          return;
        }

        this.ignorePressed.splice(this.ignorePressed.indexOf(keycode), 1);

        let action = RELEASE_ACTIONS_BY_KEY[keycode];
        if (action === undefined) {
          return;
        }

        store.dispatch(action(keycode));
      }
    }, this.node);
  }

  getXRotationMapIndex(xAxisButtonsPressed: List<number>) : number {
    let count = xAxisButtonsPressed.count();
    if (count === 0 || count === 2) {
      return 0;
    }

    let key = xAxisButtonsPressed.get(0);
    if (key === KEY_MAP.LEFT) {
      return 1;
    }

    if (key === KEY_MAP.RIGHT) {
      return 2;
    }
  }

  getYRotationMapIndex(yAxisButtonsPressed: List<number>) : number {
    let count = yAxisButtonsPressed.count();
    if (count === 0 || count === 2) {
      return 0;
    }

    let key = yAxisButtonsPressed.get(0);
    if (key === KEY_MAP.UP) {
      return 1;
    }

    if (key === KEY_MAP.DOWN) {
      return 2;
    }
  }

  getAcceleration(xAxisButtonsPressed: List<number>, yAxisButtonsPressed: List<number>) : number {
    return [xAxisButtonsPressed, yAxisButtonsPressed].reduce((acceleration, axisButtonsPressed) => {
      let count = axisButtonsPressed.count();
      return Math.min(200, acceleration + (count === 1 ? 200 : 0));
    }, 0);
  }

}
