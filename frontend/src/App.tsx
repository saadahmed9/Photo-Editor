import React from 'react';
import { Route,Routes, useNavigate } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import PassportPhoto from './MainComponents/passport1';
import PhotoResizeAndCrop from './Components/PhotoResizeAndCrop';
import PhotoCollage from './Components/PhotoCollage';
import NoiseRemoval from './Components/NoiseRemoval';
import ImageFormatConversion from './Components/ImageFormatConversion/imageFormatConversion';
import BrightnessAndContrast from './Components/BrightnessAndContrast';

interface Props {}

const App: React.FC<Props> = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="App">
     <div className="topnav">
          <a style={{cursor:'pointer'}} onClick={() => navigate('/')}><strong>Photo Editor</strong></a>
<a style={{float:'right',cursor:'pointer'}} onClick={() => navigate('/')}>Home</a>
        </div>
        <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/passportPhoto" element={<PassportPhoto />} />
      <Route path="/photoResizeAndCrop" element={<PhotoResizeAndCrop />} />
      <Route path="/photoCollage" element={<PhotoCollage />} />
      <Route path="/noiseRemoval" element={<NoiseRemoval />} />
      <Route path="/imageFormatConversion" element={<ImageFormatConversion />} />
      <Route path="/brightnessAndContrast" element={<BrightnessAndContrast />} />

    </Routes>
    </div>
    </>
    
  );
};

export default App;
