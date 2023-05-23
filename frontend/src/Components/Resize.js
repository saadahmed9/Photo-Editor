import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import {Link } from "react-router-dom";

class Resize extends Component {
  
  render() {
    
    return (
      <section className="class2">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
              
              <div className="col">
              <Link to="/resize">
                <Card title="Photo Resize" style={{ width: 500 }} hoverable>
                  <p>Allows user to resize the uploaded image.</p>
                </Card>
                </Link>
              </div>
              <div className="col">
                <img src="/resize.png" className="image" />
              </div>
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default Resize;
