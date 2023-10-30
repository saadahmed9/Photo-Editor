import React, { Component } from "react";
import Zmage from "react-zmage";
import Slide from "react-reveal";
import {Card} from 'antd';
import { Routes, Route, Link } from "react-router-dom";


class PhotoCollage extends Component {
  render() {
   
    return (
      <section className="class1">
      <Slide left duration={1300}>
        <div className="container">
          <div className="row">
            <div className="col">
              <img src="/photoCollage.png" className="image" />
            </div>
            <div className="col">
            <Link to="/photocollage">
              <Card title="Photo Collage" style={{ width: 500 }} hoverable>
                <p>Multiple photos arranged in a creative layout to create a single visual representation of user’s choice.</p>
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

export default PhotoCollage;
