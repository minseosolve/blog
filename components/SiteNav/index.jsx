import React from "react";
import { Link } from "react-router";
import { prefixLink } from "gatsby-helpers";
import "./style.css";

class SiteNav extends React.Component {
  render() {
    return (
      <nav className="blog-nav">
        <ul>
          <li>
            <Link
              to={prefixLink("/")}
              activeClassName="current"
              onlyActiveOnIndex
            >
              {" "}Articles
            </Link>
          </li>
          <li>
            <Link to={prefixLink("/about/")} activeClassName="current">
              {" "}About me
            </Link>
          </li>
          <li>
            <Link to={prefixLink("/portfolio/")} activeClassName="current">
              {" "}Portfolio
            </Link>
          </li>
          <li>
            <a target="_blank" href="http://minseoalexkim.com">Book Reviews</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default SiteNav;
