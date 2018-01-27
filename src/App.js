import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import Counter from "./components/Counter";

import StoreProvider from "./components/StoreProvider";
import actions from "./actions";
import rootReducer from "./reducers";

function logger({ getState }) {
  return next => action => {
    console.log("will dispatch", action);

    // Call the next dispatch method in the middleware chain.
    let returnValue = next(action);

    console.log("state after dispatch", getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

class App extends Component {
  render() {
    return (
      <StoreProvider
        initialState={{ counter: 0 }}
        reducer={rootReducer}
        actions={actions}
        middleware={[logger, thunk]}
      >
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Counter />
        </div>
      </StoreProvider>
    );
  }
}

export default App;
