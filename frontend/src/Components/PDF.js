import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import {Link } from "react-router-dom";

class PDF extends Component {
  
  render() {
    
    return (
      <section className="class1">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
            <div className="col">
                <img src="/PDF.png" className="image" />
              </div>
              <div className="col">
              <Link to="/pdf">
                <Card title="PDF Creator" style={{ width: 500 }} hoverable>
                  <p>Upload multiple images to generate a pdf out of it.</p>
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

export default PDF;
