import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import { Routes, Route, Link } from "react-router-dom";


class ImageFormatter extends Component {
  
  render() {
    
    return (
      <section className="class1">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
              <div className="col">
                <img src="/formatconversion.png" className="image" />
              </div>
              <div className="col">
              <Link to="/imageformatconversion">
                <Card title="Image Format Conversion" style={{ width: 500 }} hoverable>
                  <p>Users can convert their images into the desired format, such as JPEG, PNG, and more.</p>
                </Card>
                </Link>
              </div>
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default ImageFormatter;
