import {Immutable, immutable} from "../../utilities/immutable_types"
import {List} from "immutable"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {Actions, SetControlledMovementPayload, PressAxisKeyPayload} from "../actions/controller_actions"

export type ControllerState = Immutable<{
  controlledMovementId: string,
  xAxisButtonsPressed: List<number>,
  yAxisButtonsPressed: List<number>,
  fireButtonPressed: boolean,
}>;

const initialState : ControllerState = immutable({
  controlledMovementId: "",
  xAxisButtonsPressed: List(),
  yAxisButtonsPressed: List(),
  fireButtonPressed: false,
});

const updateControllerState : Reducer<ControllerState> = function(
  state: ControllerState = initialState,
  action: Action
) : ControllerState {

  switch(action.type) {

    case Actions.SET_CONTROLLED_MOVEMENT:
      {
        let payload : SetControlledMovementPayload = action.payload;
        let movementId : string = payload.get("movementId");

        return state
          .set("controlledMovementId", movementId)
          ;
      }

    case Actions.PRESS_X_AXIS_KEY:
      {
        let payload : PressAxisKeyPayload = action.payload;
        let key : number = payload.get("key");
        let xAxisButtonsPressed = state.get("xAxisButtonsPressed");

        if (xAxisButtonsPressed.includes(key)) {
          return state;
        }

        xAxisButtonsPressed = xAxisButtonsPressed.push(key);

        return state
          .set("xAxisButtonsPressed", xAxisButtonsPressed)
          ;
      }

    case Actions.PRESS_Y_AXIS_KEY:
      {
        let payload : PressAxisKeyPayload = action.payload;
        let key : number = payload.get("key");
        let yAxisButtonsPressed = state.get("yAxisButtonsPressed");

        if (yAxisButtonsPressed.includes(key)) {
          return state;
        }

        yAxisButtonsPressed = yAxisButtonsPressed.push(key);

        return state
          .set("yAxisButtonsPressed", yAxisButtonsPressed)
          ;
      }

    case Actions.PRESS_FIRE_KEY:
      {
        return state
          .set("fireButtonPressed", true)
          ;
      }

    case Actions.RELEASE_X_AXIS_KEY:
      {
        let payload : PressAxisKeyPayload = action.payload;
        let key : number = payload.get("key");
        let xAxisButtonsPressed = state.get("xAxisButtonsPressed");
        let index = xAxisButtonsPressed.indexOf(key);
        xAxisButtonsPressed = xAxisButtonsPressed.delete(index);

        return state
          .set("xAxisButtonsPressed", xAxisButtonsPressed)
          ;
      }

    case Actions.RELEASE_Y_AXIS_KEY:
      {
        let payload : PressAxisKeyPayload = action.payload;
        let key : number = payload.get("key");
        let yAxisButtonsPressed = state.get("yAxisButtonsPressed");
        let index = yAxisButtonsPressed.indexOf(key);
        yAxisButtonsPressed = yAxisButtonsPressed.delete(index);

        return state
          .set("yAxisButtonsPressed", yAxisButtonsPressed)
          ;
      }

    case Actions.RELEASE_FIRE_KEY:
      {
        return state
          .set("fireButtonPressed", false)
          ;
      }

    default:
      return state;

  }

};

export default updateControllerState;
