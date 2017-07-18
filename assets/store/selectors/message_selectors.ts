import {createSelector} from "reselect"
import {MainState} from "../reducers/main_reducer"
import {MessageCollectionState, MessageState} from "../reducers/message_reducers"

export function selectMessageCollectionState(state: MainState) : MessageCollectionState {
  return state.get('message');
};

export const selectNextMessage : (state: MainState) => MessageState =
  createSelector(
    selectMessageCollectionState,
    (state: MessageCollectionState) => state.get('next')
  );
