import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {MessageCollectionState, MessageState} from "../reducers/message_reducers"

export function selectMessageCollectionState(state: MainState | {}) : MessageCollectionState {
  return (<MainState>state).message;
};

export const selectCurrentMessage : (state: MainState | {}) => MessageState | undefined =
  createSelector(
    selectMessageCollectionState,
    (state: MessageCollectionState) => state.current
  );

export const selectHistory : (state: MainState | {}) => MessageState[] =
  createSelector(
    selectMessageCollectionState,
    (state: MessageCollectionState) => state.history
  );
