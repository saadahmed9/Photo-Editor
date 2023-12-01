import React, { Component } from "react";
import Slide from "react-reveal";
import { Card } from 'antd';
import '../passport.jpeg';
import history from '../history';
import { Routes, Route, Link } from "react-router-dom";


class PassportPhotoCreation extends Component {
  render() {

    return (

      <section className="class2">
        <Slide left duration={1300}>
          <div className="home">
            <br></br>
            <br></br>
            <br></br>
            <div className="home__heading">
              <text>Choose from our range of tools and start editing your photos.</text>
            </div>
            <div className="home__features">
                <div className="home__feature">
                <Link to="/passport">
                    <img src="/passportPhoto.png" className="image"/>
                    <br></br>
                    <h3>Create Passport Photo</h3>
                    <p>Get passport size images that meet requirements of their country of choice.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/photoresizeandcrop">
                    <img src="/photoCrop.png" alt="Crop" />
                    <br></br>
                    <h3>Photo Crop</h3>
                    <p>Cropping removes unwanted areas while keeping desired elements.</p>
                </Link>
                </div>
                <div className="home__feature">
                <Link to="/photocollage">
                    <img src="/photoCollage.png" alt="Collage" />
                    <br></br>
                    <h3>Photo Collage</h3>
                    <p>Multiple photos arranged in a creative layout to create a single representation.</p>
                </Link>
                </div>
                <div className="home__feature">
                <Link to="/noiseremoval">
                    <img src="/noiseRemoval.png" alt="Noise Removal" />
                    <br></br>
                    <h3>Noise Removal</h3>
                    <p>Users can get sharp and clean images by removing unwanted distortions or noise.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/imageformatconversion">
                    <img src="/formatconversion.png" alt="Format Conversion" />
                    <br></br>
                    <h3>Image Format Conversion</h3>
                    <p>Convert images into the desired format, such as JPEG, PNG, and more.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/backgroundchange">
                    <img src="/backgroundChange.png" alt="Change Background" />
                    <br></br>
                    <h3>Change Image Background</h3>
                    <p>Users will be able to change the background color of their photos.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/brightnessandcontrast">
                    <img src="/brightnessAndContrast.png" alt="Brightness" />
                    <br></br>
                    <h3>Brightness and Contrast</h3>
                    <p>Adjusts the brightness and contrast of photos to improve the overall look.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/Resize">
                    <img src="/photoResize.png" alt="Resize" />
                    <br></br>
                    <h3>Photo Resize</h3>
                    <p>Resize images to different dimensions without sacrificing quality..</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/pdf">
                    <img src="/pdfCreator.png" alt="Resize" />
                    <br></br>
                    <h3>PDF Creator</h3>
                    <p>Upload multiple images to generate a pdf out of it</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/mosaic">
                    <img src="/Mosaic.png" alt="Mosaic" />
                    <br></br>
                    <h3>Mosaic</h3>
                    <p>Upload multiple images to generate a mosaic out of it.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/imagecompression">
                    <img src="/imageCompression.png" alt="Image Compression" />
                    <br></br>
                    <h3>Image Compression</h3>
                    <p>Compress images into the desired format, such as JPEG, PNG, and more.</p>
                  </Link>
                </div>
                <div className="home__feature">
                <Link to="/videoCompression">
                    <img src="/videoCompression.png" alt="Resize" />
                    <br></br>
                    <h3>Video Compression</h3>
                    <p>Compress videos without compromising on their quality.</p>
                  </Link>
                </div>

            </div>
        </div>
        </Slide>
        <br></br>
        <br></br>
      </section>
    );
  }
}

export default PassportPhotoCreation;
