import React from 'react';
import { config } from 'config';
import './style.css';
import '../../static/fonts/fontawesome/style.css';

class SiteLinks extends React.Component {
  render() {
    return (
      <div className="blog-links">
        <ul>
          {config.siteTwitterUrl && (
            <li>
              <a href={config.siteTwitterUrl} target="_blank" rel="noopener noreferrer">
                <i className="fa fa-twitter" />
              </a>
            </li>
          )}
          {config.siteGithubUrl && (
            <li>
              <a href={config.siteGithubUrl} target="_blank" rel="noopener noreferrer">
                <i className="fa fa-github-alt" />
              </a>
            </li>
          )}
          {config.siteLinkedInUrl && (
            <li>
              <a
                href={config.siteLinkedInUrl}
                target="_blank" rel="noopener noreferrer"
              >
                <i className="fa fa-linkedin" /></a>
            </li>
          )}
          {config.siteEmailUrl && (
            <li>
              <a
                href={`mailto:${config.siteEmailUrl}`}
              >
                <i className="fa fa-envelope-o" />
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default SiteLinks;
