import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import MainNav from "../containers/nav/MainNav";
import AuthNav from "../containers/nav/AuthNav";
import Spinner from "../components/Spinner";
import { AuthState } from "../models/auth";
import logError from "../utils/logError";

interface InviteFriendsProps extends RouteComponentProps {
  auth: AuthState;
}

class InviteFriends extends Component<InviteFriendsProps, Readonly<any>> {
  constructor(props: InviteFriendsProps) {
    super(props);

    this.state = {
      inviteSent: false,
      friendEmails: [{ email: "" }],
      loading: false,
    };
  }

  addField = () => {
    const { friendEmails } = this.state;
    friendEmails.push({ email: "" });
    this.setState({
      friendEmails,
    });
  };

  inviteFriends = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ loading: true });

    axios
      .post("/api/friends/invite", this.state.friendEmails)
      .then((res) => {
        this.setState({ loading: false, inviteSent: res.data.success });
      })
      .catch((err) => {
        this.setState({ loading: false });
        // console.error(err);
        logError(err);
      });
  };

  inviteMore = () => {
    this.setState({ inviteSent: false, friendEmails: [{ name: "" }] });
  };

  onChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { friendEmails } = this.state;
    friendEmails[index].email = e.target.value;

    this.setState({
      friendEmails,
    });
  };

  render() {
    // const hasProfilePic = false;
    const { user } = this.props.auth;
    const { inviteSent, friendEmails, loading } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          {inviteSent ? (
            <div className="invite-friends">
              <h3 style={{ margin: "0.7em 0 1em 0" }}>Invite has been sent</h3>
              <button className="btn" onClick={this.inviteMore}>
                Invite More
              </button>
            </div>
          ) : (
            <div className="invite-friends">
              <form className="add-friend" onSubmit={this.inviteFriends}>
                <h3>Invite your friends</h3>

                {friendEmails.map((_: any, index: number) => (
                  <input
                    type="email"
                    key={index}
                    name={`email${index}`}
                    placeholder="email"
                    onChange={(e) => this.onChange(e, index)}
                  />
                ))}

                <button type="button" className="btn" onClick={this.addField}>
                  Add Input
                </button>

                {loading ? (
                  <div style={{ textAlign: "end" }}>
                    <Spinner full={false} />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn"
                    style={{ marginLeft: "auto" }}
                  >
                    Invite
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(InviteFriends);
