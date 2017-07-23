import {MainState} from "../reducers/main_reducer"
import {ConnectionState} from "../reducers/connection_reducers"
import {Socket, Channel} from "../../utilities/phoenix"
import {AnyAction} from "redux"
import {Immutable, immutable, immutableDeep} from "../../utilities/immutable_types"
import {Action, createAction} from "../actions/actions"

type Server = {
  adress: string,
  socket?: Socket,
  channel?: Channel,
};

let server : Server = {
  adress: "ws://192.168.1.6:4000/socket",
};

export type JoinActionPayload = Immutable<{
  channel: string,
  user?: string,
}>;

export type JoinAction = {
  type: "join-channel",
  payload: JoinActionPayload,
};

export function createJoinAction(payload: JoinActionPayload) : JoinAction {
  return createAction("join-channel", payload);
};

export type DispatchToServerPayload = Immutable<{
  action: AnyAction
}>;

export type DispatchToServerAction = {
  type: "dispatch-to-server",
  payload: DispatchToServerPayload,
};

export function toServer(action: AnyAction) : DispatchToServerAction {
  return createAction("dispatch-to-server", immutable({action}));
};

export enum InterceptedActions {
  JOIN_CHANNEL = "join-channel",
  DISPATCH_TO_SERVER = "dispatch-to-server",
};

export enum Actions {
  JOIN_CHANNEL_REQUEST = "join-channel-request",
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

          let channel = action.payload.get("channel");
          let payload = immutable({channel});
          console.log(`connecting to channel: ${channel}`);

          if (server.channel !== undefined) {
            server.channel.leave();
          }

          let authentication = {};

          server.channel = server.socket.channel(channel, authentication);
          server.channel.on("actions", 
            ({actionList}) => {
              console.log(actionList);
              actionList.forEach(
                (serverAction) => dispatch(
                  createAction(
                    serverAction.type,
                    immutableDeep(serverAction.payload),
                    serverAction.serverId
                  )
                )
              )
            }
          );
          server.channel
            .join()
            .receive("ok", () => dispatch(createAction(Actions.JOIN_CHANNEL_SUCCEEDED, payload)))
            .receive("error", () => dispatch(createAction(Actions.JOIN_CHANNEL_FAILED, payload)))
            ;

          return next(createAction(Actions.JOIN_CHANNEL_REQUEST, payload));
        }

      case InterceptedActions.DISPATCH_TO_SERVER:
        {
          if (server.channel === undefined) {
            console.warn("dispatch to server failed, not connected to a channel");
            return next(action);
          }

          let dispatchableAction = { ...action.payload.get("action") };
          dispatchableAction.payload = dispatchableAction.payload.toJS();
          server.channel.push("action", dispatchableAction);
          return;
        }

      default:
        return next(action);
    }

  };

};
