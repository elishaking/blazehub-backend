import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import app from "firebase/app";
import "firebase/database";
import Post from "../components/Post";
import Spinner from "../components/Spinner";

class Posts extends Component<any, Readonly<any>> {
  state = {
    posts: new Array(),
    loadingPosts: true
  };

  db = app.database();
  postsRef = this.db.ref("posts");
  mountedOn = 0;
  user: any = {};
  otherUser: any = {};

  componentDidMount() {
    this.mountedOn = Date.now();
    this.user = this.props.user;
    this.otherUser = this.props.otherUser;

    const { forProfile, otherUserId } = this.props;

    if (forProfile) {
      this.postsRef
        .orderByChild("user/id")
        .equalTo(this.otherUser ? otherUserId : this.user.id)
        .once("value", postsSnapShot => {
          const posts = postsSnapShot.val() || {};

          this.setState({
            posts: Object.keys(posts).map((_, i, postKeys) => {
              const postKey = postKeys[postKeys.length - i - 1];
              const newPost = {
                key: postKey,
                ...posts[postKey]
              };
              // set date
              newPost.date = 1e15 - newPost.date;

              if (this.state.loadingPosts)
                this.setState({ loadingPosts: false });

              return newPost;
            })
          });

          if (this.state.loadingPosts) this.setState({ loadingPosts: false });
        });

      this.postsRef.on("child_removed", postSnapShot => {
        const { posts } = this.state;

        const deleteIndex = posts.findIndex(
          (post: any) => post.key === postSnapShot.key
        );
        posts.splice(deleteIndex, 1);
        this.setState({ posts });
      });
    } else {
      this.postsRef.orderByChild("date").on("child_added", newPostSnapShot => {
        // console.log('child_added');
        const newPost = {
          key: newPostSnapShot.key,
          ...newPostSnapShot.val()
        };

        // update imageUrl
        // if (newPost.imageUrl && newPost.imageUrl !== true) {
        //   this.db.ref("post-images").child(newPost.key).set(newPost.imageUrl);
        //   this.postsRef.child(newPost.key).child("imageUrl").set(true);
        // }

        // update date
        // if (newPost.date < 1e+13) {
        //   this.postsRef.child(newPost.key).child("date").set(1e+15 - newPost.date);
        // }

        // set date
        newPost.date = 1e15 - newPost.date;

        if (this.state.loadingPosts) this.setState({ loadingPosts: false });

        const { posts } = this.state;
        newPost.date > this.mountedOn
          ? posts.unshift(newPost)
          : posts.push(newPost);
        this.setState({
          posts
        });
      });

      this.postsRef.on("child_removed", removedPostSnapShot => {
        const { posts } = this.state;

        posts.splice(
          posts.map(post => post.key).indexOf(removedPostSnapShot.key),
          1
        );

        this.setState({ posts });
      });
    }
  }

  render() {
    const { loadingPosts, posts } = this.state;
    const { avatar } = this.props;

    return (
      <React.Fragment>
        {loadingPosts ? (
          <div className="loading-container">
            <Spinner />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post: any) => (
            <Post
              key={post.key}
              // profilesRef={app.database().ref("profiles")}
              postRef={this.postsRef.child(post.key)}
              postImageRef={this.db.ref("post-images").child(post.key)}
              profilePhotosRef={this.db.ref("profile-photos")}
              bookmarkRef={this.db
                .ref("bookmarks")
                .child(this.user.id)
                .child(post.key)}
              notificationsRef={app.database().ref("notifications")}
              post={post}
              user={this.user}
              canBookmark={true}
              otherUser={this.otherUser}
            />
          ))
        ) : (
          <div
            className="loading-container"
            style={{
              padding: "1em",
              textAlign: "center"
            }}
          >
            <p>You have not created any Posts yet</p>
            <button
              className="btn"
              style={{
                marginTop: "1em"
              }}
              onClick={() => this.props.history.push("/home")}
            >
              Create Post
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Posts);
