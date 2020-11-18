import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const { CLOUD_URL, CLOUD_NAME } = require("../../keys");

const Profile = () => {
  const [myposts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch("/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((fetchedPosts) => {
        setPosts(fetchedPosts.mypost);
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (avatar) {
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
          fetch("/updateavatar", {
            method: "put",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              avatar: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, avatar: result.avatar })
              );
              dispatch({ type: "UPDATE_AVATAR", payload: result.avatar });
            });
        })
        .catch((e) => console.error(e));
    }
  }, [avatar]);

  const updateAvatar = (file) => {
    setAvatar(file);
  };

  return (
    <div style={{ maxWidth: "70%", margin: "50px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px auto",
          borderBottom: "1px solid grey",
          maxWidth: "550px",
        }}
      >
        <div>
          <img
            src={state ? state.avatar : "avatar"}
            alt="avatar"
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
          />
        </div>
        <div className="file-field input-field">
          <i className="material-icons">camera_alt</i>
          <input
            type="file"
            onChange={(e) => updateAvatar(e.target.files[0])}
          />
          <div className="file-path-wrapper hide">
            <input
              className="file-path validate"
              type="text"
              placeholder="Upload one or more files"
            />
          </div>
        </div>
        <div>
          <h5>
            {state
              ? `${state.name.charAt(0).toUpperCase()}${state.name.slice(1)}`
              : "John Doe"}
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
              <h6 style={{ color: "gray" }}>{myposts.length} Posts</h6>
              <h6 style={{ color: "gray" }}>{state && state.followers.length} Followers</h6>
              <h6 style={{ color: "gray" }}>{state && state.following.length} Following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {myposts.map((post) => {
          return (
            <img
              className="item"
              id={post._id}
              src={post.photo}
              alt={post.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
