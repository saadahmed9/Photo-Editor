import React, { Component } from "react";
import { Slide } from "react-reveal";
import {Card } from 'antd';
import { Routes, Route, Link } from "react-router-dom";


class NoiseRemoval extends Component {
  render() {
   
    return (
      <section  className="class2">
      <Slide left duration={1300}>
        <div className="container">
          <div className="row">
           
            <div className="col">
            <Link to="/noiseremoval">
              <Card title="Noise Removal" style={{ width: 500 }} hoverable>
                <p>Users can get sharp and clean images by removing unwanted distortions or noise.</p>
              </Card>
              </Link>
            </div>
            <div className="col">
              <img src="/NoiseRemoval.jpeg" className="image" />
            </div>
          </div>
        </div>
      </Slide>
    </section>
    );
  }
}

export default NoiseRemoval;
