import {createStore, applyMiddleware, compose} from 'redux'
import connectionMiddleware from "./middleware/connection_middleware"
import reduce from "./reducers/main_reducer"

let global = <any>window;

const composeMiddleware = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

let store = createStore(reduce, {}, composeMiddleware(
  applyMiddleware(connectionMiddleware)
));
export default store;
