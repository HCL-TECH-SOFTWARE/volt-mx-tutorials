import { createLogger } from "redux-logger";
import withRedux from "next-redux-wrapper";
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers";
import thunk from "redux-thunk";

function createMiddlewares() {
  let middlewares = [thunk];
  if ((process.env.NODE_ENV === "development" || process.env.NODE_ENV === "testing") && typeof window !== "undefined") {
    middlewares.push(
      createLogger({
        level: "info",
        collapsed: true
      })
    );
  }

  return middlewares;
}


const composeEnhancers = process.browser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;

export const initStore = (initialState = {}) => {
  let middlewares = createMiddlewares();

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export default comp => withRedux(initStore)(comp);
