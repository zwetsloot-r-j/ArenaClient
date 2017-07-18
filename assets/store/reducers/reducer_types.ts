import {Action} from "../actions/actions"

export type Reducer<State> = (state: State, action: Action) => State;
