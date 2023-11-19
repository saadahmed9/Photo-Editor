import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import { Routes, Route, Link } from "react-router-dom";


class ImageCompression extends Component {
  
  render() {
    
    return (
            <section className="class1">
                <Slide left duration={1300}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <img src="/imageCompression.png" className="image" />
                            </div>
                            <div className="col">
                                <Link to="/imagecompression">
                                    <Card title="Image Compression" style={{ width: 500 }} hoverable>
                                    <p>Users can compress their images into the desired format, such as JPEG, PNG, and more.</p>
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

export default ImageCompression;
