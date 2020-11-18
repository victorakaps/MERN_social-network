import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import M from "materialize-css";

const NewPasswd = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [isEye, setEye] = useState(false);
  const { token } = useParams();
  console.log(token);
  const newPasswd = () => {
    fetch("/newpassword", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPass: password,
        authToken: token,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { error, message } = data;
        if (error) {
          M.toast({
            html: `Invalid Credentials`,
            classes: "#c62828 red darken-3",
          });
        } else {
          M.toast({
            html: `${message}`,
            classes: "#43a047 green darken-1",
          });
          history.push("/signin");
        }
      })
      .catch((e) => console.error(e));
  };
  return (
    <div className="sup-card">
      <div className="card sub-card">
        <h2>SCUTI'S 42</h2>
        <span>
          <input
            type={!isEye ? "password" : "text"}
            placeholder="Enter New Password"
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
          onClick={() => newPasswd()}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default NewPasswd;
