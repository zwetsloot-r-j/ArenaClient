import {Reducer, AnyAction} from "redux"
import {Actions, MessagePayload} from "../actions/message_actions"

export type MessageState = {
  body: string,
  displayTime: number
};

export type MessageCollectionState = {
  next?: MessageState,
  history: MessageState[],
};

const initialState : MessageCollectionState = {
  history: [],
};

const updateMessageState : Reducer<MessageCollectionState> = function(
  state: MessageCollectionState = initialState,
  action: AnyAction
) : MessageCollectionState {

  switch(action.type) {

    case Actions.MESSAGE:
      {
        let payload : MessagePayload = action.payload;
        let next : MessageState = payload.message;
        let history = state.next === undefined ? state.history : [ state.next, ...state.history ];
        return { ...state, next, history };
      }

    default:
      return state;

  }

};

export default updateMessageState;
