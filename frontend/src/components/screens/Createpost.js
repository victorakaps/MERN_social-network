import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const {
  CLOUD_URL,
  CLOUD_NAME,
} = require("../../keys");

const Createpost = () => {
  const history = useHistory();

  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState("");
  const [mediaUrl, setUrl] = useState("");

  useEffect(() => {
    if (mediaUrl) {
      createPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaUrl]);

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", media);
    data.append("upload_preset", "social-media");
    data.append("cloud_name", CLOUD_NAME);
    fetch(CLOUD_URL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((e) => console.error(e));
  };

  const createPost = () => {
    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        title: caption,
        description,
        mediaUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#43a047 red darken-3" });
        } else {
          M.toast({ html: "Posted", classes: "#43a047 green darken-1" });
          history.push("/");
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <div
      className="card input-file"
      style={{
        margin: "25px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#00bfa5"
      }}
    >
      <input 
        className="njhfdndnnd"
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        type="text"
        className="njhfdndnnd"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn">
          <span>Photo</span>
          <input type="file" onChange={(e) => setMedia(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate njhfdndnnd"
            type="text"
            placeholder="Upload one or more files"
          />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light"
        onClick={() => uploadImage()}
      >
        Post
      </button>
    </div>
  );
};

export default Createpost;
