import {Immutable, immutable} from "../../utilities/immutable_types"
import {createAction, Action} from "./actions"

export enum Projectiles {
  LaserBeam,
}

export enum Actions {
  SPAWN_PROJECTILE = "spawn-projectile",
  DESPAWN_PROJECTILE = "despawn-projectile",
  UPDATE_MOVEMENT_ID = "update-movement-id",
};

export type SpawnProjectilePayload = Immutable<{
  id: string,
  playerId: string,
  movementId: string,
  type: Projectiles,
}>;

export type DespawnProjectilePayload = Immutable<{
  id: string,
}>;

export function spawnProjectile(
  playerId: string,
  type: Projectiles,
  movementId: string,
) : Action {
  let action = createAction(Actions.SPAWN_PROJECTILE, <SpawnProjectilePayload>immutable({
    id: "0", playerId, movementId, type
  }));
  let payload : SpawnProjectilePayload = action.payload;
  payload = payload
    .set("id", action.clientId)
    ;
  action.payload = payload;
  return action;
};

export function despawnProjectile(id: string) : Action {
  return createAction(Actions.DESPAWN_PROJECTILE, <DespawnProjectilePayload>immutable({id}));
};
