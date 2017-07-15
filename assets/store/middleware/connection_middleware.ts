import {MainState} from "../reducers/main_reducer"
import {ConnectionState} from "../reducers/connection_reducers"

const connectActionType = "connection";

export type ConnectActionPayload = {
  channel: string,
};

export type ConnectAction = {
  type: "connection",
  payload: ConnectActionPayload,
};

export enum Actions {
  CONNECTION_REQUEST = "connection-request",
  CONNECTION_SUCCEEDED = "connection-succeeded",
  CONNECTION_FAILED = "connection-failed",
};

export function createConnectAction(payload: ConnectActionPayload) : ConnectAction {
  return {
    type: "connection",
    payload,
  }
};

export default function({dispatch, getState}) {

  return next => action => {
    if (action.type !== connectActionType) {
      return next(action);
    }

    let mainState = <MainState>getState();
    let connectionState = <ConnectionState>mainState.connection;

    if (connectionState.socket === undefined) {
      console.warn("trying to connect to a channel while not being connected to a socket yet");
      //todo send out error action
      return next(action);
    }

    let channel = action.payload.channel;

    if (~connectionState.joinedChannels.indexOf(channel)) {
      console.warn("already connected to channel");
      //todo send out error action
      return next(action);
    }

    let payload = {channel};
    console.log(`connecting to channel: ${channel}`);

    let channelConnection = connectionState.socket.channel(channel, {});
    channelConnection.on("action", (serverAction) => dispatch(serverAction));
    channelConnection
      .join()
      .receive("ok", () => dispatch({type: Actions.CONNECTION_SUCCEEDED, payload}))
      .receive("error", () => dispatch({type: Actions.CONNECTION_FAILED, payload}))
      ;

    return next({type: Actions.CONNECTION_REQUEST, payload});
  };

};
