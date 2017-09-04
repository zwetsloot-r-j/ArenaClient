import subscribe from "../utilities/subscriber"
import store from "../store/store"
import {ProjectileState} from "../store/reducers/projectile_reducers"
import {composeProjectileStateSelector} from "../store/selectors/projectile_selectors"

const {ccclass} = cc._decorator;

@ccclass
export default class Projectile extends cc.Component {

  private unsubscribe: () => void

  initialize(state: ProjectileState) : void {
    let movementComponent = this.node.getComponent("movement");
    movementComponent.initialize(state.get("movementId"));

    this.unsubscribe = subscribe(composeProjectileStateSelector(state.get("id")), (state: ProjectileState) => this.render(state));
  }

  render(state: ProjectileState) : void {
    let movementComponent = this.node.getComponent("movement");
    movementComponent.changeId(state.get("movementId"));
  }

  onDestroy() : void {
    this.unsubscribe(); 
  }

}
