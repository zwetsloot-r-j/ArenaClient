import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {ProjectileCollectionState, ProjectileState} from "../reducers/projectile_reducers"

export function selectProjectileCollectionState(state: MainState) : ProjectileCollectionState {
  return state.get("projectiles");
};

export function composeProjectileStateSelector(id: string) : (state: MainState) => ProjectileState {
  return createSelector(
    selectProjectileCollectionState,
    (state: ProjectileCollectionState) => state.get("projectiles").get(id),
  );
};
