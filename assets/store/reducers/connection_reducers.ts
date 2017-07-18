import {Immutable, immutable} from "../../utilities/immutable_types"
import {Actions, JoinActionPayload} from "../middleware/connection_middleware"
import {Action} from "../actions/actions"
import {Reducer} from "./reducer_types"


export type ConnectionState = Immutable<{
  connecting: boolean,
  channelName: string,
}>;

const initialState = immutable({
  connecting: false,
  channelName: "",
});

const updateConnectionState : Reducer<ConnectionState> = function(
  state: ConnectionState = initialState,
  action: Action
) : ConnectionState {

  switch(action.type) {

    case Actions.JOIN_CHANNEL_REQUEST:
      {
        let payload : JoinActionPayload = action.payload;
        let channel : string = payload.get("channel");
        return state
          .set("connecting", true)
          .set("channelName", channel)
          ;
      }

    case Actions.JOIN_CHANNEL_SUCCEEDED:
      return state
        .set("connecting", false)
        ;

    case Actions.JOIN_CHANNEL_FAILED:
      return state
        .set("connecting", false)
        .set("channelName", "")
        ;

    default:
      return state;
  }

};

export default updateConnectionState;
