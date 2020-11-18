import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import M from "materialize-css";

const ResetPaswd = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");

  const resetPass = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      console.log(email);
      M.toast({ html: `Invalid Email`, classes: "#c62828 red darken-3" });
    } else {
      fetch("/resetpassword", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({
              html: `Invalid Credentials`,
              classes: "#c62828 red darken-3",
            });
          } else {
            M.toast({
              html: `${data.message}`,
              classes: "#43a047 green darken-1",
            });
            history.push("/signin");
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
          className="njhfdndnnd"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light"
          onClick={() => resetPass()}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPaswd;
