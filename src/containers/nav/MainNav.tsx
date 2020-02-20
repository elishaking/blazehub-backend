import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserAlt,
  faComments,
  faBookmark,
  faSignOutAlt,
  faUsers,
  faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import { signoutUser } from "../../actions/authActions";
import "./Nav.scss";

function MainNav({ user, signoutUser: signoutUserFunc }: any) {
  const { firstName, lastName } = user;
  const signOut = () => signoutUserFunc();

  return (
    <div className="main-nav">
      <header>
        <h3>{`${firstName} ${lastName}`}</h3>
      </header>
      <nav>
        <ul>
          <li>
            <Link to="/home">
              <FontAwesomeIcon icon={faHome} /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <FontAwesomeIcon icon={faComments} /> <span>Chat</span>
            </Link>
          </li>
          <li>
            <Link to="/profile">
              <FontAwesomeIcon icon={faUserAlt} /> <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/bookmarks">
              <FontAwesomeIcon icon={faBookmark} /> <span>Bookmarks</span>
            </Link>
          </li>
          <li>
            <Link to="/find">
              <FontAwesomeIcon icon={faUsers} /> <span>Find Friends</span>
            </Link>
          </li>
          <li>
            <Link to="/invite">
              <FontAwesomeIcon icon={faUserFriends} />{" "}
              <span>Invite Friends</span>
            </Link>
          </li>
          <li className="hide-wide">
            <Link to="#" onClick={signOut}>
              <FontAwesomeIcon icon={faSignOutAlt} /> <span>Sign Out</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default connect(null, { signoutUser })(MainNav);
