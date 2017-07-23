import {createStore, applyMiddleware, compose} from "redux"
import * as Immutable from "immutable"
import connectionMiddleware from "./middleware/connection_middleware"
import duplicatePurificationMiddleware from "./middleware/duplicate_purification_middleware"
import reduce from "./reducers/main_reducer"

let global = <any>window;

const composeMiddleware = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

let store = createStore(reduce, Immutable.Map(), composeMiddleware(
  applyMiddleware(connectionMiddleware),
  applyMiddleware(duplicatePurificationMiddleware)
));
export default store;
