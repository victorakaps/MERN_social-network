import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../App";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    console.log("State Has changed");
  }, [state]);

  useEffect(() => {
    fetch("/getallposts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((fetchedPosts) => {
        console.log(fetchedPosts);
        setPosts(fetchedPosts.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postID: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setPosts(newData);
      })
      .catch((e) => console.log(e));
  };

  const dislikePost = (id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postID: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setPosts(newData);
      })
      .catch((e) => console.log(e));
  };

  const makeComment = (text, postID) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        text,
        postID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = posts.map((post) => {
          if (post._id === result._id) {
            return result;
          } else {
            return post;
          }
        });
        setPosts(newData);
      })
      .catch((e) => console.log(e));
  };

  const deletePost = (postID) => {
    fetch(`/delete/${postID}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = posts.filter((post) => {
          return post._id !== result._id;
        });
        setPosts(newData);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="home">
      {posts.map((post) => {
        return (
          <div className="card home-card" key={post._id}>
            <div className="card-image">
              <ul className="collection author-collection">
                <li className="collection-item avatar">
                  <Link
                    to={
                      post.author._id !== state._id
                        ? `/profile/${post.author._id}`
                        : `/profile`
                    }
                  >
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="circle"
                    />
                  </Link>
                  <Link
                    to={
                      post.author._id !== state._id
                        ? `/profile/${post.author._id}`
                        : `/profile`
                    }
                  >
                    <span className="title" style={{ fontWeight: 600 }}>
                      {post.author.name}
                    </span>
                  </Link>

                  {post.author._id === state._id && (
                    <span className="secondary-content">
                      <i
                        className="material-icons"
                        onClick={() => {
                          deletePost(post._id);
                        }}
                        style={{ float: "right" }}
                      >
                        delete
                      </i>
                    </span>
                  )}
                </li>
              </ul>
              <img src={post.photo} alt={`post by ${post.author.name}`} />
              <span
                className="card-title"
                style={{ fontWeight: 600 }}
              >{`${post.title.charAt(0).toUpperCase()}${post.title.slice(
                1
              )}`}</span>
              <span className="btn-floating halfway-fab waves-effect waves-light red left">
                {post.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => {
                      dislikePost(post._id);
                    }}
                  >
                    star
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => {
                      likePost(post._id);
                    }}
                  >
                    star_border
                  </i>
                )}
              </span>
            </div>

            <div className="card-content">
              <span
                className="title"
                style={{ fontSize: "140%", fontWeight: 600 }}
              >
                {post.likes.length} STARS
              </span>
              <p style={{ fontSize: "140%", color: "gray" }}>
                {post.description}
              </p>
              <br />
              <ul className="collection comments-collection">
                {post.comments.map((comment) => {
                  return (
                    <li className="collection-item avatar">
                      <Link
                        to={
                          comment.postedBy._id !== state._id
                            ? `/profile/${comment.postedBy._id}`
                            : `/profile`
                        }
                      >
                        <img
                          src={comment.postedBy.avatar}
                          alt=""
                          className="circle comments-collection___li-avatar"
                        />
                      </Link>
                      <Link
                        to={
                          comment.postedBy._id !== state._id
                            ? `/profile/${comment.postedBy._id}`
                            : `/profile`
                        }
                      >
                        <span className="title comments-collection___li-title">
                          {comment.postedBy.name}
                        </span>
                      </Link>

                      <p style={{ marginLeft: "70px" }}>{comment.text}</p>
                    </li>
                  );
                })}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, post._id);
                }}
              >
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="njhfdndnnd"
                />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
