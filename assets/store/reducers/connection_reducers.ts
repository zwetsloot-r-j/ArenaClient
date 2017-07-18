import {Reducer, AnyAction} from "redux"
import {Actions, JoinActionPayload} from "../middleware/connection_middleware"
import {Socket} from "../../utilities/phoenix"

const server = "ws://localhost:4000/socket";

export type ConnectionState = {
  connecting: boolean,
  channelName: string,
};

const initialState = {
  connecting: false,
  channelName: "",
};

const updateConnectionState : Reducer<ConnectionState> = function(
  state: ConnectionState = initialState,
  action: AnyAction
) : ConnectionState {

  switch(action.type) {

    case Actions.JOIN_CHANNEL_REQUEST:
      let requestPayload : JoinActionPayload = action.payload;
      return { ...state,
        connecting: true,
        channelName: requestPayload.channel,
      };

    case Actions.JOIN_CHANNEL_SUCCEEDED:
      let succeededPayload : JoinActionPayload = action.payload;
      return { ...state,
        connecting: false,
      };

    case Actions.JOIN_CHANNEL_FAILED:
      let failedPayload : JoinActionPayload = action.payload;
      console.warn(`connection failed for channel: ${failedPayload.channel}`);
      return { ...state,
        connecting: false,
        channelName: "",
      };

    default:
      return state;
  }

};

export default updateConnectionState;
