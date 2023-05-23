import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import {Link } from "react-router-dom";

class BrightnessAndContrast extends Component {
  
  render() {
    
    return (
      <section className="class1">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
            <div className="col">
                <img src="/BrightnessContrast.jpeg" className="image" />
              </div>
              <div className="col">
              <Link to="/brightnessandcontrast">
                <Card title="Brightness and Contrast" style={{ width: 500 }} hoverable>
                  <p>Users will be able to adjust the brightness and contrast of their photos to improve the overall look.</p>
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

export default BrightnessAndContrast;
