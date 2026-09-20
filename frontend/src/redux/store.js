import { applyMiddleware, combineReducers, createStore } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";

import applicationReducer from "./applicationReducer";
import applicationEpics from "./applicationEpic";

const rootReducer = combineReducers({
  applications: applicationReducer,
});

const rootEpic = combineEpics(...applicationEpics);

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  rootReducer,
  applyMiddleware(epicMiddleware)
);

epicMiddleware.run(rootEpic);

export default store;