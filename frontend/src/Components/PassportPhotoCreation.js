import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import '../passport.jpeg';
import history from '../history';
import { Routes, Route, Link } from "react-router-dom";


class PassportPhotoCreation extends Component {
  render() {

    return (

      <section className="class1">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
              <div className="col">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ1SEFzoI-Vt9R70QNa62hv5n9lZNFS4eVwA&usqp=CAU" className="image"/>
              </div>
              <div className="col">
              <Link to="/passport">
                <Card title="Passport Photo Creation" style={{ width: 500 }} hoverable>
                  <p>Get passport size images that meet requirements of their country of choice.</p>
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

export default PassportPhotoCreation;
