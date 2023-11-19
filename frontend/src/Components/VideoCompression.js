import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import { Link } from "react-router-dom";

class VideoCompression extends Component {

    render() {

        return (
            <section className="class2">
                <Slide left duration={1300}>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Link to="/videoCompression">
                                    <Card title="Video Compression" style={{ width: 500 }} hoverable>
                                        <p>Compress videos without compromising on their quality.</p>
                                    </Card>
                                </Link>
                            </div>
                            <div className="col">
                                <img src="/videoCompression.png" className="image" />
                            </div>


                        </div>
                    </div>
                </Slide>
            </section>
        );
    }
}

export default VideoCompression;
