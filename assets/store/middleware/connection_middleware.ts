import {MainState} from "../reducers/main_reducer"
import {ConnectionState} from "../reducers/connection_reducers"
import {Socket, Channel} from "../../utilities/phoenix"
import {AnyAction} from "redux"

type Server = {
  adress: string,
  socket?: Socket,
  channel?: Channel,
};

let server : Server = {
  adress: "ws://localhost:4000/socket",
};

export type JoinActionPayload = {
  channel: string,
  user?: string,
};

export type JoinAction = {
  type: "join-channel",
  payload: JoinActionPayload,
};

export function createJoinAction(payload: JoinActionPayload) : JoinAction {
  return {
    type: "join-channel",
    payload,
  }
};

export type DispatchToServerPayload = {
  action: AnyAction
};

export type DispatchToServerAction = {
  type: "dispatch-to-server",
  payload: DispatchToServerPayload,
};

export function toServer(action: AnyAction) : DispatchToServerAction {
  return {
    type: "dispatch-to-server",
    payload: {action},
  }
};

export enum InterceptedActions {
  JOIN_CHANNEL = "join-channel",
  DISPATCH_TO_SERVER = "dispatch-to-server",
};

export enum Actions {
  JOIN_CHANNEL_REQUEST = "join_channel-request",
  JOIN_CHANNEL_SUCCEEDED = "join-channel-succeeded",
  JOIN_CHANNEL_FAILED = "join-channel-failed",
};

export default function({dispatch, getState}) {

  return next => action => {

    switch (action.type) {

      case InterceptedActions.JOIN_CHANNEL:
        {
          if (server.socket === undefined) {
            server.socket = new Socket(server.adress, {params: {}});
            server.socket.connect();
          }

          let channel = action.payload.channel;
          let payload = {channel};
          console.log(`connecting to channel: ${channel}`);

          if (server.channel !== undefined) {
            server.channel.leave();
          }

          let authentication = action.payload.user === undefined ? {} : {user: action.payload.user};

          server.channel = server.socket.channel(channel, authentication);
          server.channel.on("actions", 
            ({actionList}) => actionList.forEach(
              (serverAction) => dispatch(serverAction)
            )
          );
          server.channel
            .join()
            .receive("ok", () => dispatch({type: Actions.JOIN_CHANNEL_SUCCEEDED, payload}))
            .receive("error", () => dispatch({type: Actions.JOIN_CHANNEL_FAILED, payload}))
            ;

          return next({type: Actions.JOIN_CHANNEL_REQUEST, payload});
        }

      case InterceptedActions.DISPATCH_TO_SERVER:
        {
          if (server.channel === undefined) {
            console.warn("dispatch to server failed, not connected to a channel");
            return next(action);
          }

          server.channel.push("action", action.payload.action);
          return next(action);
        }

      default:
        next(action);
    }

  };

};
