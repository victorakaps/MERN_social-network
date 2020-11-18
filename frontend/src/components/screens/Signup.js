import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const { CLOUD_URL, CLOUD_NAME } = require("../../keys");

const Signup = () => {
  const history = useHistory();

  const [isEye, setEye] = useState(false);
  const [name, setName] = useState("");
  const [displayname, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    if (avatarUrl) {
      uploadFields();
    }
  }, [avatarUrl]);

  const SignupUser = () => {
    if (avatar) {
      uploadAvatar();
    } else {
      uploadFields();
    }
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: `Invalid Email`, classes: "#c62828 red darken-3" });
    } else {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          displayname,
          password,
          email,
          avatar: avatarUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: `${data.error}`, classes: "#c62828 red darken-3" });
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

  const uploadAvatar = () => {
    const data = new FormData();
    data.append("file", avatar);
    data.append("upload_preset", "social-media");
    data.append("cloud_name", CLOUD_NAME);
    fetch(CLOUD_URL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setAvatarUrl(data.url);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div className="sup-card">
      <div className="card sub-card">
        <h2>SCUTI'S 42</h2>
        <input
          className="njhfdndnnd"
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="njhfdndnnd"
          placeholder="Last Name"
          value={displayname}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Avatar</span>
            <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Upload Profile Picture"
            />
          </div>
        </div>
        <button
          className="btn waves-effect waves-light"
          onClick={() => SignupUser()}
        >
          Sign Up
        </button>
        <p style={{ fontWeight: 700 }}>
          <Link to="/signin">Already have an account?</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
