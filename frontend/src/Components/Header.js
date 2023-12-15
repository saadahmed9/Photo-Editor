import React, { Component } from "react";
import Fade from "react-reveal";


class Header extends Component {

  render() {

    return (
      <header >       
        <div className="row banner">
          <div className="banner-text">
            <Fade bottom>
              <h1 className="responsive-headline">Photo Editor</h1>
            </Fade>
            <Fade bottom duration={1200}>
              <h3>The Photo Editor project is a web application designed to enhance and manipulate digital images. It allows users to edit and enhance their photos with a variety of tools and features, including cropping, resizing, adjusting brightness and contrast. The software is user-friendly, offering an intuitive interface and the ability to undo or redo actions. The project is aimed at individuals who want to improve their photos or use them for personal or professional purposes.</h3>
            </Fade>
            <hr />
            
          </div>
          <div className="banner-text">
          <Fade>
            <br></br>
            <br></br>
          <h4 className="text-danger">Your Privacy Matters</h4>
          <h4>We do not retain any user information on our servers. We do not retain any of your images on our servers, and failing to download your edited image may result in the loss of your work.</h4>
          </Fade>
          </div>
        </div>

      </header>
    );
  }
}

export default Header;
