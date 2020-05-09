import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";

import "./Feedback.scss";
import AuthNav from "../containers/nav/AuthNav";
import MainNav from "../containers/nav/MainNav";
import { AuthState } from "../models/auth";
import {
  TextFormInput,
  TextAreaFormInput,
} from "../components/form/TextFormInput";
import { FeedbackErrors } from "../models/feedback";
import Spinner from "../components/Spinner";
import logError from "../utils/logError";
import { sendFeedback } from "../actions/feedback";

interface FeedbackProps extends RouteComponentProps {
  auth: AuthState;
}

class Feedback extends Component<FeedbackProps> {
  state = {
    loading: false,
    feedbackSent: false,
    errors: {} as FeedbackErrors,

    email: "",
    name: "",
    message: "",
  };

  onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { name, email, message } = this.state;
    const { user } = this.props.auth;
    const feedbackData = {
      name: name || `${user.firstName} ${user.lastName}`,
      email: email || user.email,
      message,
    };

    sendFeedback(feedbackData)
      .then((data: any) => {
        this.setState({ loading: false, feedbackSent: data.success });

        if (data.success)
          setTimeout(() => {
            this.setState({ feedbackSent: false });
          }, 3000);
      })
      .catch((err) => {
        this.setState({ loading: false });
        logError(err);
      });
  };

  render() {
    const { user } = this.props.auth;
    const { errors, loading, feedbackSent } = this.state;

    return (
      <div className="container">
        <AuthNav showSearch={true} history={this.props.history} />

        <div className="main">
          <MainNav user={user} />

          <div className="form-container">
            <h1 className="mb-1">Help BlazeHub improve</h1>
            <form onSubmit={this.onSubmit}>
              <TextFormInput
                type="text"
                name="name"
                placeholder="name"
                error={errors.name}
                onChange={this.onChange}
                value={`${user.firstName} ${user.lastName}`}
              />

              <TextFormInput
                type="email"
                name="email"
                placeholder="email"
                error={errors.email}
                onChange={this.onChange}
                value={user.email}
              />

              <TextAreaFormInput
                name="message"
                placeholder="How or where will you like BlazeHub to improve"
                error={errors.message}
                onChange={this.onChange}
                rows={5}
              />

              {loading ? (
                <Spinner full={false} />
              ) : feedbackSent ? (
                <p>Feedback Sent</p>
              ) : (
                <input
                  type="submit"
                  value="Send Feedback"
                  className="btn-input btn-pri"
                />
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Feedback);
