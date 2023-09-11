import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import {Link } from "react-router-dom";

class Mosaic extends Component {
  
  render() {
    
    return (
      <section className="class2">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
            <div className="col">
              <Link to="/mosaic">
                <Card title="Mosaic" style={{ width: 500 }} hoverable>
                  <p>Upload multiple images to generate a mosaic out of it.</p>
                </Card>
                </Link>
              </div>
            <div className="col">
                <img src="/Mosaic.png" className="image" />
              </div>
              
              
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default Mosaic;
