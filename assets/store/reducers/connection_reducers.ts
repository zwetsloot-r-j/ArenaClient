import {Reducer, AnyAction} from "redux"
import {Actions} from "../actions/connection_actions"
import {Actions as MiddlewareActions, ConnectActionPayload} from "../middleware/connection_middleware"
import {Socket} from "../../utilities/phoenix"

const server = "ws://localhost:4000/socket";

export type ConnectionState = {
  connecting: boolean,
  channelName: string,
  joinedChannels: string[],
  socket?: Socket,
};

const initialState = {
  connecting: false,
  channelName: "",
  joinedChannels: []
};

const updateConnectionState : Reducer<ConnectionState> = function(
  state: ConnectionState = initialState,
  action: AnyAction
) : ConnectionState {

  switch(action.type) {

    case Actions.CONNECT:
      if (state.socket !== undefined) {
        return state;
      }

      let socket = new Socket(server, {params: {}});
      socket.connect();
      return { ...state,
        socket 
      };

    case MiddlewareActions.CONNECTION_REQUEST:
      let requestPayload = <ConnectActionPayload>action.payload;
      return { ...state,
        connecting: true,
        channelName: requestPayload.channel,
      };

    case MiddlewareActions.CONNECTION_SUCCEEDED:
      let succeededPayload = <ConnectActionPayload>action.payload;
      return { ...state,
        connecting: false,
        channelName: "",
        joinedChannels: [ ...state.joinedChannels, succeededPayload.channel ],
      };

    case MiddlewareActions.CONNECTION_FAILED:
      let failedPayload = <ConnectActionPayload>action.payload;
      console.warn(`connection failed for channel: #{failedPayload.channel}`);
      return { ...state,
        connecting: false,
        channelName: "",
      };

    default:
      return state;
  }

};

export default updateConnectionState;
