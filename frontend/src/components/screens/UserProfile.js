import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import { UserContext } from "../../App";

const UserProfile = () => {
  const [userData, setData] = useState(null);

  const { state, dispatch } = useContext(UserContext);
  const { userID } = useParams();

  const [isFollow, setFollow] = useState(
    state ? state.following.includes(userID) : false
  );

  useEffect(() => {
    fetch(`/user/${userID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((usrData) => {
        setData(usrData);
      })
      .catch((e) => console.error(e));
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        userID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE_USER",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        setData((pervState) => {
          return {
            ...pervState,
            user: {
              ...pervState.user,
              followers: [...pervState.user.followers, result._id],
            },
          };
        });
        setFollow(true);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        userID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE_USER",
          payload: { following: result.following, followers: result.followers },
        });
        localStorage.setItem("user", JSON.stringify(result));
        setData((pervState) => {
          const updatedFollowers = pervState.user.followers.filter(
            (item) => item !== result._id
          );
          return {
            ...pervState,
            user: {
              ...pervState.user,
              followers: updatedFollowers,
            },
          };
        });
        setFollow(false);
      });
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
            src={userData ? userData.user.avatar : "avatar"}
            alt="avatar"
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
          />
        </div>
        <div>
          <h5>{userData ? userData.user.name : "John Doe"}</h5>
          <h5>{userData && userData.user.email}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{userData && userData.posts.length} Posts</h6>
            <h6>{userData && userData.user.followers.length} Followers</h6>
            <h6>{userData && userData.user.following.length} Following</h6>
            {isFollow ? (
              <button
                className="btn waves-effect waves-light"
                onClick={() => unfollowUser()}
              >
                unfollow
              </button>
            ) : (
              <button
                className="btn waves-effect waves-light"
                onClick={() => followUser()}
              >
                follow
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="gallery">
        {userData &&
          userData.posts.map((post) => {
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

export default UserProfile;
