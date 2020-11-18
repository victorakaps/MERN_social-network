import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const Navbar = () => {
  const searchModal = useRef(null);
  const sideNav = useRef(null);

  const history = useHistory();

  const [search, setSearch] = useState("");
  const [fetchedUsers, setfetchedUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    M.Modal.init(searchModal.current);
    M.Sidenav.init(sideNav.current);
  }, []);

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT_USER" });
    history.push("/signin");
  };

  const searchUsers = (query) => {
    console.log(query);
    setSearch(query);
    fetch("/searchusers", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.user);
        setfetchedUsers(result.user);
      })
      .catch((e) => console.log(e));
  };

  const showLinks = () => {
    if (state) {
      return [
        <li key="search" id="search-icon">
          <i
            className="large material-icons modal-trigger"
            data-target="modal1"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="logout">
          <button className="btn logout-btn" onClick={() => logout()}>
            Log Out
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="signin" style={{ fontWeight: 700 }}>
          <Link to="/signin">SIGN IN</Link>
        </li>,
        <li key="sigup" style={{ fontWeight: 700 }}>
          <Link to="/signup">SIGN UP</Link>
        </li>,
      ];
    }
  };
  return (
    <>
      <nav className="nav-extended">
        <div className="nav-wrapper teal">
          <Link
            to={state ? "/" : "/signin"}
            className="brand-logo left hide-on-small-only"
          >
            SCUTI'S 42
          </Link>
          <Link
            to={"/"}
            data-target="mobile-demo"
            className="sidenav-trigger hide-on-med-and-up"
          >
            <i className="material-icons">menu</i>
          </Link>

          <ul id="nav-mobile" className="right">
            <React.Fragment>{showLinks()}</React.Fragment>
          </ul>
        </div>
        {state && (
          <div className="nav-content hide-on-small-only">
            <ul className="tabs tabs-transparent">
              <li className="tab">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="tab">
                <Link to="/create">create post</Link>
              </li>
              <li className="tab">
                <Link to="/postsforme">posts for me</Link>
              </li>
              <li className="tab">
                <Link to="/">ALl posts</Link>
              </li>
            </ul>
          </div>
        )}
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => searchUsers(e.target.value)}
            />
            <ul className="collection">
              {fetchedUsers.map((user) => {
                return (
                  <Link
                    to={
                      user._id !== state._id
                        ? `profile/${user._id}`
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li className="collection-item">{user.name}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo" ref={sideNav}>
        <li className="tab">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="tab">
          <Link to="/create">Create Post</Link>
        </li>
        <li className="tab">
          <Link to="/postsforme">Posts for me</Link>
        </li>
        <li className="tab">
          <Link to="/">All Posts</Link>
        </li>
      </ul>
    </>
  );
};
export default Navbar;
