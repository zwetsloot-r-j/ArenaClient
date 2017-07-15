import {Reducer, AnyAction} from "redux"

enum Actions {
  MESSAGE = "message",
};

export type MessageState = {
  body: string,
  displayTime?: number
};

export type MessageCollectionState = {
  current?: MessageState,
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
      let current = <MessageState>action.payload;
      let history = state.current === undefined ? state.history : [ state.current, ...state.history ];
      return { ...state, current, history };

    default:
      return state;

  }

};

export default updateMessageState;
