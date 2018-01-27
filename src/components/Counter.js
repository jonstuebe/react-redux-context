import React, { Component } from "react";
import ReduxContext from "../context";

class Connect extends Component {
  static defaultProps = {
    mapStateToProps: state => {
      return state;
    }
  };
  render() {
    return (
      <ReduxContext.Consumer>
        {({ dispatch, state, actions }) => {
          const filteredState = this.props.mapStateToProps(state);
          const passedProps = {
            dispatch,
            state: filteredState,
            actions
          };
          if (this.props.render) {
            return this.props.render(passedProps);
          }
          return this.props.children(passedProps);
        }}
      </ReduxContext.Consumer>
    );
  }
}

export default () => (
  <Connect
    mapStateToProps={state => {
      return state.counter;
    }}
  >
    {({ dispatch, state, actions }) => (
      <div>
        <button
          onClick={() => {
            dispatch(actions.decrement());
          }}
        >
          decrement
        </button>
        <button
          onClick={() => {
            dispatch(actions.increment());
          }}
        >
          increment
        </button>

        <div>Counter: {state}</div>
      </div>
    )}
  </Connect>
);
