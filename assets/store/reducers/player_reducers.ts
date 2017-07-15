import {Reducer, AnyAction} from "redux"
import {Actions, AddPlayerPayload} from "../actions/player_actions"

export type PlayerState = {
  id: string,
};

export type PlayerCollectionState = {
  playerCount: number,
  players: {[id: string]: PlayerState}
};

const initialState : PlayerCollectionState = {
  playerCount: 0,
  players: {}
};

const updatePlayerState : Reducer<PlayerCollectionState> = function(
  state: PlayerCollectionState = initialState,
  action: AnyAction
) : PlayerCollectionState {

  switch(action.type) {

    case Actions.ADD_PLAYER:
      let payload = <AddPlayerPayload>action.payload;
      let {player} = payload;

      return { ...state,
        playerCount: state.playerCount + 1,
        players: {[player.id]: player}
      };

    default:
      return state;
  }

};

export default updatePlayerState;
