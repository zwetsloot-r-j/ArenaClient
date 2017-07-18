import {Immutable, immutable} from "../../utilities/immutable_types"
import {List} from "immutable"
import {Actions, MessagePayload} from "../actions/message_actions"
import {Action} from "../actions/actions"
import {Reducer} from "./reducer_types"

export type MessageState = Immutable<{
  body: string,
  displayTime: number
}>;

export type MessageCollectionState = Immutable<{
  next?: MessageState,
  history: List<MessageState>,
}>;

const initialState : MessageCollectionState = immutable({
  history: List(),
});

const updateMessageState : Reducer<MessageCollectionState> = function(
  state: MessageCollectionState = initialState,
  action: Action
) : MessageCollectionState {

  switch(action.type) {

    case Actions.MESSAGE:
      {
        let payload : MessagePayload = action.payload;
        let next : MessageState = payload.get("message");
        let previous : MessageState | undefined = state.get("next");
        let history : List<MessageState> = state.get("history");

        if (previous !== undefined) {
          state = state.set("history", history.unshift(previous));
        }
        return state.set("next", next);
      }

    default:
      return state;

  }

};

export default updateMessageState;
