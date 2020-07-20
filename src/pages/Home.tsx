import React, { Component } from "react";
import { connect } from "react-redux";
import app from "firebase/app";
import "firebase/database";
// import axios from 'axios';
// import { initializeApp, updateUsername, updatePostLikeKeys } from '../utils/firebase';

// import { signoutUser } from "../actions/authActions";
import { getProfilePic } from "../actions/profile";

import { resizeImage } from "../utils/resizeImage";

import "./Home.scss";
import MainNav from "../containers/nav/MainNav";
import AuthNav from "../containers/nav/AuthNav";
import Posts from "../containers/Posts";
import { AuthState } from "../models/auth";
import logError from "../utils/logError";
import { PostActions, PostImage, PostInput } from "../components/organisms";

interface HomeState {
  postText: string;
  postImgDataUrl: string;
  notifications: any[];
  loadingNotifications: boolean;
  [key: string]: any;
}

interface HomeProps {
  auth: AuthState;
  profile: any;
  getProfilePic: (
    userId: string,
    key: string
  ) => (dispatch: any) => Promise<void>;
}

class Home extends Component<HomeProps, Readonly<HomeState>> {
  db = app.database();
  postsRef = this.db.ref("posts");
  postImagesRef = this.db.ref("post-images");

  constructor(props: HomeProps) {
    super(props);

    this.state = {
      postText: "",
      postImgDataUrl: "",
      notifications: [],
      loadingNotifications: true,
    };

    // this.setupFirebase();
  }

  componentDidMount() {
    // initializeApp(this);
    // updateUsername();
    // this.setupFirebase();
    // updatePostLikeKeys()

    const { profile, auth } = this.props;
    if (!profile.avatar) this.props.getProfilePic(auth.user.id, "avatar");
  }

  /**
   * Initialize firebase references
   */
  // setupFirebase = () => {
  //   this.db = app.database();
  //   this.postsRef = this.db.ref('posts');
  //   this.postImagesRef = this.db.ref('post-images');
  //   // this.notificationsRef = this.db.ref('notifications');
  // }

  /**
   * Opens file explorer for image attachment to new post
   */
  selectImage = () => {
    const postImgInput = document.getElementById("post-img") as HTMLElement;
    postImgInput.click();
  };

  /**
   * Opens Emoticon explorer
   */
  selectEmoticon = () => {
    // console.log("Opening emoticon explorer")
  };

  /**
   * Remove image attached to new post
   */
  removeImage = () => {
    this.setState({ postImgDataUrl: "" });
  };

  /**
   * Display image attached to new post
   */
  showImage = (e: any) => {
    const postImgInput = e.target;

    if (postImgInput.files && postImgInput.files[0]) {
      const imgReader = new FileReader();

      imgReader.onload = (err: any) => {
        if (postImgInput.files[0].size > 100000)
          resizeImage(
            err.target.result.toString(),
            postImgInput.files[0].type
          ).then((dataUrl: any) => {
            this.setState({ postImgDataUrl: dataUrl });
          });
        else this.setState({ postImgDataUrl: err.target.result });
      };

      imgReader.readAsDataURL(postImgInput.files[0]);
    }
  };

  /**
   * Create new post.
   * Updates database with new post
   */
  createPost = () => {
    const { postText, postImgDataUrl } = this.state;
    const newPost = {
      user: this.props.auth.user,
      text: postText,
      isBookmarked: false,
      date: 1e15 - Date.now(),
      imageUrl: postImgDataUrl !== "",
      // likes: { name: "likes" },
      // comments: { name: "comments" },
      // shares: { name: "shares" }
    };
    this.postsRef
      .push(newPost)
      .then((post: any) => {
        if (newPost.imageUrl)
          this.postImagesRef.child(post.key).set(postImgDataUrl);
      })
      .catch((err) => {
        logError(err);
      });

    this.setState({
      postText: "",
      postImgDataUrl: "",
    });
  };

  /**
   * Updates react-state with new data
   */
  onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { user } = this.props.auth;
    const { postText, postImgDataUrl } = this.state;
    const { avatar } = this.props.profile || "";

    return (
      <div className="container" data-test="homeComponent">
        <AuthNav
          showSearch={true}
          avatar={avatar}
          notificationsRef={this.db.ref("notifications")}
        />

        <div className="main">
          <MainNav user={user} />

          <div className="main-feed">
            <header>
              <div className="create-post">
                <h3>Create Post</h3>

                <PostInput postText={postText} onChange={this.onChange} />

                <PostImage
                  postImgDataUrl={postImgDataUrl}
                  removeImage={this.removeImage}
                />

                <PostActions
                  createPost={this.createPost}
                  showImage={this.showImage}
                  selectImage={this.selectImage}
                  selectEmoticon={this.selectEmoticon}
                />
              </div>
            </header>

            <div className="posts">
              <Posts user={user} />
            </div>
          </div>

          {/* <div className="extras">

          </div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  profile: state.profile,
});

export const HomePage = connect<any>(mapStateToProps, { getProfilePic })(Home);
