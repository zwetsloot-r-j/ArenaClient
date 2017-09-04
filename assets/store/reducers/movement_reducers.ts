import {Immutable, immutable} from "../../utilities/immutable_types"
import {List} from "immutable"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {
  Actions,
  SyncMovementPayload,
  SetStartPositionPayload,
  UpdateMovementPayload,
  RecalculateMovementHistoryPayload,
  CacheMovementStatePayload,
} from "../actions/movement_actions"

export type ActionHistoryMovementStatus = Immutable<{
  gameTime: number,
  x: number,
  y: number,
  acceleration: number,
  externalForceX: number,
  externalForceY: number,
  rotation: number,
}>;

export type ActionHistoryBlock = Immutable<{
  status?: ActionHistoryMovementStatus,
  actions: List<Action>,
}>;

export type MovementState = Immutable<{
  movementId: string,
  rotation: number,
  x: number,
  y: number,
  acceleration: number,
  externalForceX: number,
  externalForceY: number,
  actionHistory: List<ActionHistoryBlock>,
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
  actionHistory: List([
    immutable({
      actions: List(),
    }),
  ]),
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
        if (movement === undefined) {
          movement = initialMovementState.set("movementId", movementId);
          state = state.set("movementCount", state.get("movementCount") + 1);
        }
        let rotation : number = payload.get("rotation");
        let x : number = payload.get("x");
        let y : number = payload.get("y");

        let actionHistory : List<ActionHistoryBlock> = movement.get("actionHistory");
        let lastActionHistory : ActionHistoryBlock = actionHistory.last();
        let actions : List<Action> = lastActionHistory
          .get("actions")
          .push(action)
          ;

        lastActionHistory = lastActionHistory.set("actions", actions);
        actionHistory = actionHistory.pop().push(lastActionHistory);

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

        let actionHistory : List<ActionHistoryBlock> = movement.get("actionHistory");
        let lastActionHistory : ActionHistoryBlock = actionHistory.last();
        let actions : List<Action> = lastActionHistory
          .get("actions")
          .push(action)
          ;

        lastActionHistory = lastActionHistory.set("actions", actions);
        actionHistory = actionHistory.pop().push(lastActionHistory);

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

    case Actions.RECALCULATE_MOVEMENT_HISTORY:
      {
        let payload : RecalculateMovementHistoryPayload = action.payload;
        let movementId : string = payload.get("id");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements.get(movementId);
        let actionHistory : List<ActionHistoryBlock> = movement
          .get("actionHistory")
          ;

        while (true) {
          if (actionHistory.count() <= 1) {
            break;
          }
          let actionHistoryBlock : ActionHistoryBlock = actionHistory.last();
          let movementStatus : ActionHistoryMovementStatus = actionHistoryBlock.get("status");
          if (!movementStatus) {
            break;
          }
          if (!actionHistoryBlock.get("actions").some((action: Action) => action.gameTime < movementStatus.get("gameTime"))) {
            break;
          }
          actionHistory = actionHistory.pop();
          let previous : ActionHistoryBlock = actionHistory.last();
          previous.set("actions", previous.get("actions").concat(actionHistoryBlock.get("actions")));
          actionHistory = actionHistory.pop().push(previous);
        }

        movement = movement.set("actionHistory", actionHistory);
        movements = movements.set(movementId, movement);

        return state
          .set("movements", movements)
          ;
      }

    case Actions.CACHE_MOVEMENT_STATE:
      {
        let payload : CacheMovementStatePayload = action.payload;
        let movementId : string = payload.get("id");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements.get(movementId);
        let actionHistory : List<ActionHistoryBlock> = movement.get("actionHistory");
        let newActionHistoryBlock : ActionHistoryBlock = immutable({
          status: payload.get("movementStatus"),
          actions: List(),
        });
        actionHistory = actionHistory.push(newActionHistoryBlock);
        movement = movement.set("actionHistory", actionHistory);
        movements = movements.set(movementId, movement);

        return state
          .set("movements", movements)
          ;
      }

    case Actions.UPDATE_MOVEMENT_ID:
      {
        let payload : UpdateMovementIdPayload = acion.payload;
        let movementId : string = payload.get("from");
        let newMovementId : string = payload.get("to");
        let movements : Immutable<{[id: string] : MovementState}> = state.get("movements");
        let movement : MovementState = movements
          .get(movementId)
          .set("movementId", newMovementId)
          ;

        movements = movements
          .set(newMovementId, movement)
          .delete(movementId)
          ;

        return state
          .set("movements", movements)
          ;
        
      }

    default:
      return state;

  }

};

export default updateMovementState;
