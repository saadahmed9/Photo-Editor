import React, { Component } from "react";
import ReactGA from "react-ga";
import $ from "jquery";
import "./App.css";
import { Routes,Route} from "react-router";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PassportPhotoCreation from "./Components/PassportPhotoCreation";
import PhotoResizeAndCrop from "./Components/PhotoResizeAndCrop";
import NoiseRemoval from "./Components/NoiseRemoval";
import PhotoCollage from "./Components/PhotoCollage";
import ImageFormatter from "./Components/ImageFormatter";
import BrightnessAndContrast from "./Components/BrightnessAndContrast";
import BackgroundChange from "./Components/BackgroundChange";
import Resize from "./Components/Resize";
import PDF from "./Components/PDF";
import Mosaic from "./Components/Mosaic";
import Stats from './Components/Stats';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foo: "bar",
      editorData: {}
    };

    ReactGA.initialize("UA-110570651-1");
    ReactGA.pageview(window.location.pathname);
  }



  render() {
    return (
      <div className="Home">
        <Header/>
        <PassportPhotoCreation />
        <PhotoResizeAndCrop  />
        <PhotoCollage  />
        <NoiseRemoval  />
        <ImageFormatter/>
        <BackgroundChange/>
        <BrightnessAndContrast/>
        <Resize/>
        <PDF/>
        <Mosaic/>
        <Stats/>
        <Footer  />
      </div>
    );
  }
}

export default Home;
