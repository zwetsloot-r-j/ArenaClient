import subscribe from "../utilities/subscriber"
import {selectProjectileCollectionState} from "../store/selectors/projectile_selectors"
import {ProjectileCollectionState, ProjectileState} from "../store/reducers/projectile_reducers"
import {Projectiles} from "../store/actions/projectile_actions"
import {immutable, Immutable} from "../utilities/immutable_types"
import {List} from "immutable"
const {ccclass, property} = cc._decorator;

@ccclass
export default class ProjectileSpawner extends cc.Component {

  @property({
    default: [],
    type: cc.Prefab,
  })
  private projectilePrefabs: cc.Prefab[] = []
  private unsubscribe: () => void
  private spawnedProjectiles: Immutable<{[id: string]: cc.Node}>

  onLoad() : void {
    this.unsubscribe = subscribe(selectProjectileCollectionState, (state: ProjectileCollectionState) => this.render(state));
    this.spawnedProjectiles = immutable({});
  }

  render(state: ProjectileCollectionState) : void {
    let projectiles = state.get("projectiles");

    this.spawnedProjectiles = this.spawnedProjectiles.filter((projectileInstance: cc.Node, id: string) => {
      if (projectiles.has(id)) {
        return true;
      }
      this.despawnProjectile(projectileInstance);
      return false;
    });

    projectiles.forEach((projectile: ProjectileState, id: string) => {
      if (this.spawnedProjectiles.has(id)) {
        return;
      }

      this.spawnProjectile(projectile);
    });
  }

  spawnProjectile(projectile: ProjectileState) : void {
    let projectileInstance = cc.instantiate(this.projectilePrefabs[projectile.get("type")]);
    let projectileComponent = projectileInstance.getComponent("projectile");
    projectileComponent.initialize(projectile);

    this.node.addChild(projectileInstance);
    this.spawnedProjectiles = this.spawnedProjectiles.set(projectile.get("id"), projectileInstance);
  }

  despawnProjectile(projectileInstance: cc.Node) : void {
    projectileInstance.removeFromParent();
  }

}
