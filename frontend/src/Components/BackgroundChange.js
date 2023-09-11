import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import {Link } from "react-router-dom";

class BackgroundChange extends Component {
  
  render() {
    
    return (
      <section className="class2">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
              
              <div className="col">
              <Link to="/backgroundchange">
                <Card title="Background Change" style={{ width: 500 }} hoverable>
                  <p>Users will be able to change the background color of their photos.</p>
                </Card>
                </Link>
              </div>
              <div className="col">
                <img src="/backgroundChange.jpeg" className="image" />
              </div>
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default BackgroundChange;
