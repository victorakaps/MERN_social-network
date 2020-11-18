import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEye, setEye] = useState(false);

  const signinUser = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: `Invalid Email`, classes: "#c62828 red darken-3" });
    } else {
      fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const { token, user } = res;
          if (!token) {
            M.toast({
              html: `Invalid Credentials`,
              classes: "#c62828 red darken-3",
            });
          } else {
            localStorage.setItem("jwt", token);
            localStorage.setItem("user", JSON.stringify(user));
            dispatch({ type: "SAVE_USER", payload: user });
            M.toast({
              html: `Welcome, ${user.name}`,
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        })
        .catch((e) => console.error(e));
    }
  };
  return (
    <div className="sup-card">
      <div className="card sub-card">
        <h2>SCUTI'S 42</h2>
        <input
          type="text"
          className="njhfdndnnd"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span>
          <input
            type={!isEye ? "password" : "text"}
            className="njhfdndnnd"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            onClick={() => setEye(!isEye)}
            className="material-icons"
            style={{ position: "absolute", right: "30px" }}
          >
            {isEye ? "visibility" : "visibility_off"}
          </i>
        </span>
        <button
          className="btn waves-effect waves-light"
          onClick={() => signinUser()}
        >
          Signin
        </button>
        <p style={{ fontWeight: 700 }}>
          <Link to="/signup">Don't have an account?</Link>
        </p>
        <p style={{ fontWeight: 500 }}>
          <Link to="/resetpassword">Forgot Password</Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
