export default (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      state++;
      return state;
    case "DECREMENT":
      state--;
      return state;
    default:
      return state;
  }
};
