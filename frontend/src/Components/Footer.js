import React, { Component } from "react";
import Fade from "react-reveal";
import history from '../history';

class Footer extends Component {
  

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  render() {
    

    return (
      <footer>
        <div className="row">
          

          <div id="go-top">
            <a className="smoothscroll" title="Back to Top" onClick={this.scrollToTop}>
              <i className="icon-up-open"></i>
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
