import { createStore, combineReducers } from "redux";
import * as rootReducer from "./reducers";

const store = createStore(combineReducers(rootReducer));

export default store;
