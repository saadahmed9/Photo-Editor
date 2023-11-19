import React, { Component } from "react";
import ReactGA from "react-ga";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home.js"
import PassportPhoto from "./MainComponents/PassportPhoto/passportPhoto";
import BrightnessContrast from "./MainComponents/BrightnessContrast/BrightnessContrast";
import NoiseRemoval from "./MainComponents/NoiseRemoval/NoiseRemoval";
import Demo from "./MainComponents/Demo";
import FormatConversion from "./MainComponents/FormatConversion/FormatConversion";
import BackgroundRemoval from "./MainComponents/BackgroundRemoval/BackgroundRemoval";
import ResizeImage from "./MainComponents/ResizeImage/ResizeImage";
import PdfCreator from "./MainComponents/PdfCreator/PdfCreator";
import Mosaic from "./MainComponents/Mosaic/Mosaic";
import ImageCompression from "./MainComponents/ImageCompression/ImageCompression";
import VideoCompression from "./MainComponents/VideoCompression/VideoCompression";
import { v4 as uuidv4 } from 'uuid';
import Collage from "./MainComponents/PhotoCollage/Collage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: uuidv4(),
    };
    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
     
      <div className="App">
                <ToastContainer position="bottom-right"/>

         <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>

          <ul id="nav" className="nav">
            <li>
            <img src="/logo.png" className="image" style={{marginTop:'0px'}}/>

            </li>
            <div style={{position:'relative',display:'inline'}}>


            <li className="current">
              <Link to="/">Home</Link>
            </li>

            <div className="dropdown">
              <button className="dropbtn">Features</button>
              <div className="dropdown-content glass-effect">
                  <div className="dropdown-grid">
                  <Link to="/passport">Passport Photo</Link>
                  <Link to="/photoresizeandcrop">Crop</Link>
                  <Link to="/photocollage">Collage</Link>
                  <Link to="/noiseremoval">Noise Removal</Link>
                  <Link to="/imageformatconversion">Format Conversion</Link>
                  <Link to="/backgroundchange">Background Change</Link>
                  <Link to="/brightnessandcontrast">Brightness And Contrast</Link>
                  <Link to="/resize">Resize</Link>
                  <Link to="/mosaic">Mosaic</Link>
                  <Link to="/pdf">PDF</Link>
                  <Link to="/Imagecompression">Image Compression</Link>
                  <Link to="/VideoCompression">Video Compression</Link>
                  </div>
              </div>

              </div>

            
            </div>

          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/passport" element={<PassportPhoto uuid={this.state.uuid} />} />
          <Route path="/photoresizeandcrop" element={<Demo uuid={this.state.uuid}/>} />
          <Route path="/photocollage" element={<Collage uuid={this.state.uuid}/>} />
          <Route path="/noiseremoval" element={<NoiseRemoval uuid={this.state.uuid}/>} />
          <Route path="/imageformatconversion" element={<FormatConversion uuid={this.state.uuid}/>} />
          <Route path="/imagecompression" element={<ImageCompression uuid={this.state.uuid}/>} />
          <Route path="/videocompression" element={<VideoCompression uuid={this.state.uuid}/>} />
          <Route path="/brightnessandcontrast" element={<BrightnessContrast uuid={this.state.uuid}/>} />
          <Route path="/backgroundchange" element={<BackgroundRemoval  uuid={this.state.uuid}/>} />
          <Route path="/resize" element={<ResizeImage  uuid={this.state.uuid}/>} />
          <Route path="/pdf" element={<PdfCreator  uuid={this.state.uuid}/>} />
          <Route path="/mosaic" element={<Mosaic  uuid={this.state.uuid}/>} />
        </Routes>
      </div>
    );
  }
}

export default App;