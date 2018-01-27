import React, { Component } from "react";
import PropTypes from "prop-types";

import ReduxContext from "../context";

const ActionTypes = {
  INIT:
    "@@redux/INIT" +
    Math.random()
      .toString(36)
      .substring(7)
      .split("")
      .join("."),
  REPLACE:
    "@@redux/REPLACE" +
    Math.random()
      .toString(36)
      .substring(7)
      .split("")
      .join(".")
};

export default class StoreProvider extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    reducer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
    middleware: PropTypes.array,
    initialState: PropTypes.object
  };
  static defaultProps = {
    middleware: [],
    initialState: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      storeState: props.initialState,
      isDispatching: false
    };
    if (props.middleware.length > 0) {
      this.dispatch = this.applyMiddleware(props.middleware);
    } else {
      this.dispatch = this._dispatch;
    }
    this.setupReducer(props.reducer);
  }
  componentDidMount() {
    this.dispatch({ type: ActionTypes.INIT });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.reducer !== nextProps.reducer) {
      this.setupReducer(nextProps.reducer);
    }
  }
  setupReducer = reducer => {
    if (typeof reducer !== "function") {
      this.reducer = this.combineReducers(reducer);
    } else {
      this.reducer = reducer;
    }
  };
  getState = () => {
    if (this.state.isDispatching) {
      throw new Error(
        "You may not call store.getState() while the reducer is executing. " +
          "The reducer has already received the state as an argument. " +
          "Pass it down from the top reducer instead of reading it from the store."
      );
    }
    return Object.assign({}, this.state.storeState);
  };
  compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg;
    }

    if (funcs.length === 1) {
      return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
  }
  applyMiddleware = middlewares => {
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      );
    };
    let chain = [];

    const middlewareAPI = {
      getState: this.getState,
      dispatch: (...args) => dispatch(...args)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = this.compose(...chain)(this._dispatch);

    return dispatch;
  };
  _dispatch = action => {
    if (typeof action.type === "undefined") {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          "Have you misspelled a constant?"
      );
    }

    if (this.state.isDispatching) {
      throw new Error("Reducers may not dispatch actions.");
    }

    this.setState(
      {
        isDispatching: true,
        storeState: this.reducer(this.getState(), action)
      },
      () => {
        this.setState({ isDispatching: false });
      }
    );

    return action;
  };
  combineReducers = reducers => {
    return function combination(state = {}, action) {
      for (let reducerKey in reducers) {
        const newState = reducers[reducerKey](state[reducerKey], action);
        if (newState !== state[reducerKey]) {
          state[reducerKey] = newState;
        }
      }
      return state;
    };
  };
  render() {
    return (
      <ReduxContext.Provider
        value={{
          state: this.state.storeState,
          dispatch: this.dispatch,
          actions: this.props.actions
        }}
      >
        {this.props.children}
      </ReduxContext.Provider>
    );
  }
}
