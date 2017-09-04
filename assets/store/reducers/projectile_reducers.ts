import {Immutable, immutable} from "../../utilities/immutable_types"
import {Reducer} from "./reducer_types"
import {Action} from "../actions/actions"
import {Actions, Projectiles, SpawnProjectilePayload, DespawnProjectilePayload} from "../actions/projectile_actions"
import {UpdateMovementPayload} from "../actions/movement_actions"

export type ProjectileState = Immutable<{
  id: string,
  playerId: string,
  movementId: string,
  type: Projectiles,
}>;

export type ProjectileCollectionState = Immutable<{
  projectileCount: number,
  projectiles: Immutable<{[id: string]: ProjectileState}>,
}>;

const initialState : ProjectileCollectionState = immutable({
  projectileCount: 0,
  projectiles: immutable({}),
});

const updateProjectileState : Reducer<ProjectileCollectionState> = function(
  state: ProjectileCollectionState = initialState,
  action: Action,
) : ProjectileCollectionState {

  switch(action.type) {

    case Actions.SPAWN_PROJECTILE:
      {
        let payload : SpawnProjectilePayload = action.payload;
        let projectileId : string = payload.get("id");
        let projectileState : ProjectileState = immutable({
          id: projectileId,
          playerId: payload.get("playerId"),
          movementId: payload.get("movementId"),
          type: payload.get("type"),
        });

        let projectileCount = state.get("projectileCount") + 1;
        let projectiles = state
          .get("projectiles")
          .set(projectileId, projectileState)
          ;

        return state
          .set("projectileCount", projectileCount)
          .set("projectiles", projectiles)
          ;
      }
    
    case Actions.DESPAWN_PROJECTILE:
      {
        let payload : DespawnProjectilePayload = action.payload;
        let projectileId : string = payload.get("id");
        
        let projectiles = state
          .get("projectiles")
          .delete(projectileId)
          ;

        return state
          .set("projectiles", projectiles)
          ;
      }

    case Actions.UPDATE_MOVEMENT_ID:
      {
        let payload : UpdateMovementIdPayload = action.payload;
        let from : string = payload.get("from");
        let to : string = payload.get("to");
        let projectiles = state
          .get("projectiles")
          ;

        let projectile = projectiles
          .find((projectile: ProjectileState) => projectile.get("movementId") === from)
          .set("movementId", to)
          ;
        
        projectiles = projectiles
          .set(projectile.get("id"), projectile)
          ;

        return state
          .set("projectiles", projectiles)
          ;

      }

    default:
      return state;
  }

};

export default updateProjectileState;
