import {Immutable, immutable} from "../../utilities/immutable_types"
import {Actions, AddPlayerPayload} from "../actions/player_actions"
import {Action} from "../actions/actions"
import {Reducer} from "./reducer_types"

export type PlayerState = Immutable<{
  id: string,
}>;

export type PlayerCollectionState = Immutable<{
  playerCount: number,
  players: Immutable<{[id: string]: PlayerState}>
}>;

const initialState : PlayerCollectionState = immutable({
  playerCount: 0,
  players: immutable({})
});

const updatePlayerState : Reducer<PlayerCollectionState> = function(
  state: PlayerCollectionState = initialState,
  action: Action
) : PlayerCollectionState {

  switch(action.type) {

    case Actions.ADD_PLAYER:
      let payload : AddPlayerPayload = action.payload;
      let player : PlayerState = payload.get("player");
      let playerCount = state.get("playerCount");
      let players = state.get("players")
        .set(player.get("id"), player);

      return state
        .set("playerCount", playerCount + 1)
        .set("players", players)
        ;

    default:
      return state;
  }

};

export default updatePlayerState;
