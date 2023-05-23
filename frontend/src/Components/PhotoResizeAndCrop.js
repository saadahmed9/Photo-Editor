import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import { Routes, Route, Link } from "react-router-dom";



class PhotoResizeAndCrop extends Component {
  
  render() {
    
    return (
      <section className="class2">
        <Slide left duration={1300}>
          <div className="container">
            <div className="row">
              
              <div className="col">
              <Link to="/photoresizeandcrop">
                <Card title="Photo Crop" style={{ width: 500 }} hoverable>
                  <p>Cropping removes unwanted areas while keeping desired elements.</p>
                </Card>
                </Link>
              </div>
              <div className="col">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQci2ouAMeuzt13WH12zo__-QD2nihq8D-PjA&usqp=CAU" className="image" />
              </div>
            </div>
          </div>
        </Slide>
      </section>
    );
  }
}

export default PhotoResizeAndCrop;
