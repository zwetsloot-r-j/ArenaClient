import subscribe from "../utilities/subscriber"
import store from "../store/store"
import {MainState} from "../store/reducers/main_reducer"
import {selectFighterCollectionState} from "../store/selectors/fighter_selectors"
import {selectBattlePlayer} from "../store/selectors/battle_selectors"
import {setControlledMovement} from "../store/actions/controller_actions"
import {FighterCollectionState, FighterState} from "../store/reducers/fighter_reducers"
import {List} from "immutable"
const {ccclass, property} = cc._decorator;

@ccclass
export default class FighterSpawner extends cc.Component {

  @property({
    default: null,
    type: cc.Prefab
  })
  private fighter: cc.Prefab
  private unsubscribe: () => void
  private spawnedFighters: List<string>

  onLoad() : void {
    this.unsubscribe = subscribe(selectFighterCollectionState, (state: FighterCollectionState) => this.render(state));
    this.spawnedFighters = List();
  }

  render(state: FighterCollectionState) : void {
    if (state.get("fighterCount") === this.spawnedFighters.count()) {
      return;
    }

    let fighters = state.get("fighters");
    fighters.forEach((fighter : FighterState, id: string) => {
      if (this.spawnedFighters.includes(id)) {
        return;
      }

      this.spawnFighter(fighter);
      this.spawnedFighters = this.spawnedFighters.push(id);
    });
  }

  spawnFighter(fighter: FighterState) : void {
    let fighterInstance = cc.instantiate(this.fighter);
    let fighterComponent = fighterInstance.getComponent("fighter");
    fighterComponent.initialize(fighter);

    this.node.addChild(fighterInstance);

    if (fighter.get("playerId") === selectBattlePlayer(<MainState>store.getState())) {
      store.dispatch(setControlledMovement(fighter.get("movementId")));
    }
  }

  onExit() : void {
    this.unsubscribe();
    this.spawnedFighters = List();
  }
}
