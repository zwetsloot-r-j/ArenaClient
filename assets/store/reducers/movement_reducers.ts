import {Immutable, immutable} from "../../utilities/immutable_types"
import {List} from "immutable"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {
  Actions,
  SyncMovementPayload,
  SetStartPositionPayload,
  CreateMovementPayload,
  UpdateMovementPayload
} from "../actions/movement_actions"

export type MovementState = Immutable<{
  movementId: string,
  rotation: number,
  x: number,
  y: number,
  acceleration: number,
  externalForceX: number,
  externalForceY: number,
  actionHistory: List<Action>,
  version: number,
}>;

export type MovementCollectionState = Immutable<{
  movementCount: number,
  movements: Immutable<{[id: string]: MovementState}>
}>;

const initialMovementState : MovementState = immutable({
  movementId: "",
  rotation: 0,
  x: 0,
  y: 0,
  acceleration: 0,
  externalForceX: 0,
  externalForceY: 0,
  actionHistory: List(),
  version: -1,
});

const initialState : MovementCollectionState = immutable({
  movementCount: 0,
  movements: immutable({})
});

const updateMovementState : Reducer<MovementCollectionState> = function(
  state: MovementCollectionState = initialState,
  action: Action
) : MovementCollectionState {

  switch(action.type) {

    case Actions.SYNC_MOVEMENT:
      {
        let payload : SyncMovementPayload = action.payload;
        let movementId : string = payload.get("id");
        let version : number = payload.get("version");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements.get(movementId);
        if (movement === undefined) {
          movement = initialMovementState.set("movementId", movementId);
          state = state.set("movementCount", state.get("movementCount") + 1);
        }
        movement = movement.set("version", version);
        movements = movements.set(movementId, movement);

        return state
          .set("movements", movements)
          ;
      }

    case Actions.SET_START_POSITION:
      {
        let payload : SetStartPositionPayload = action.payload;
        let movementId : string = payload.get("movementId");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements.get(movementId)
        let rotation : number = payload.get("rotation");
        let x : number = payload.get("x");
        let y : number = payload.get("y");

        let actionHistory = movement.get("actionHistory")
          .push(action)
          ;
        movement = movement
          .set("movementId", movementId)
          .set("rotation", rotation)
          .set("x", x)
          .set("y", y)
          .set("actionHistory", actionHistory)
          ;
        movements = movements.set(movementId, movement);

        return state
          .set("movements", movements)
          ;
      }

    case Actions.UPDATE_MOVEMENT:
      {
        let payload : UpdateMovementPayload = action.payload;
        let movementId : string = payload.get("movementId");
        let rotation : number = payload.get("rotation");
        let acceleration : number = payload.get("acceleration");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements.get(movementId);

        if (movement === undefined) {
          return state;
        }

        let actionHistory = movement.get("actionHistory")
          .push(action)
          ;
        movement = movement
          .set("actionHistory", actionHistory)
          .set("acceleration", acceleration)
          ;
        
        if (rotation !== undefined) {
          movement = movement.set("rotation", rotation);
        }

        movements = movements.set(movementId, movement);

        return state
          .set("movements", movements)
          ;
      }

    default:
      return state;

  }

};

export default updateMovementState;
