export const initState = null;

export const reducer = (state, action) => {
  if (action.type === "SAVE_USER") {
    return action.payload;
  }
  if (action.type === "LOGOUT_USER") {
    return null;
  }
  if (action.type === "UPDATE_USER") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }
  if (action.type === "UPDATE_AVATAR") {
    return {
      ...state,
      avatar: action.payload,
    };
  }
  return state;
};
