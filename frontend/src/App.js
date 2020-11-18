import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import Navbar from "./components/Navbar";
import "./App.css";

import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import Createpost from "./components/screens/Createpost";
import SubscribedPosts from "./components/screens/SubscribedPosts";
import ResetPasswd from "./components/screens/ResetPaswd";
import NewPasswd from "./components/screens/NewPasswd";

import { initState, reducer } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "SAVE_USER", payload: user });
      // history.push("/");
    } else {
      if (!history.location.pathname.startsWith("/reset")) {
        history.push("/signin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <Createpost />
      </Route>
      <Route path="/profile/:userID">
        <UserProfile />
      </Route>
      <Route path="/postsforme">
        <SubscribedPosts />
      </Route>
      <Route exact path="/resetpassword">
        <ResetPasswd />
      </Route>
      <Route path="/resetpassword/:token">
        <NewPasswd />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
