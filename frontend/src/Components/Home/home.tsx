import React, { Component, useState } from 'react';
import './home.css';
import { Card, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';


function Home() {
    const title = 'Home Page';
    const navigate = useNavigate();

    return (
      <>
        <div style={{height:'100%'}}>
          <Row gutter={120} style={{ margin: '75px' }}>
            <Col span={8}>
              <div onClick={() => navigate('/passportPhoto')}>
              <Card title="Passport photo 
creation" bordered={true} style={{height:'172px'}}hoverable>
                Get passport size images that meet requirements of their country of choice
              </Card>
              </div>
            </Col>
            <Col span={8}>
            <div onClick={() => navigate('/photoResizeAndCrop')}>
              <Card title="Photo resize and 
Crop" bordered={true} hoverable>
                Resizing changes photo dimensions, cropping removes unwanted areas while keeping desired elements.
              </Card>
              </div>
            </Col>
            <Col span={8}>
            <div onClick={() => navigate('/photoCollage')}>
              <Card title="Photo Collage" bordered={true} hoverable>
                Multiple photos arranged in a creative layout to create a single visual representation of user’s choice.
              </Card>
              </div>
            </Col>
          </Row>
          <Row gutter={120} style={{ margin: '75px' }}>
            <Col span={8}>
            <div onClick={() => navigate('/noiseRemoval')}>
              <Card title="Noise Removal" bordered={true} hoverable>
                Users can get sharp and clean images by removing unwanted distortions or noise.
              </Card>
              </div>
            </Col>
            <Col span={8}>
            <div onClick={() => navigate('/imageFormatConversion')}>
              <Card title="Image format conversion" bordered={true} hoverable>
                Users can convert their images into the desired format, such as JPEG, PNG, and more.
              </Card>
              </div>
            </Col>
            <Col span={8}>
            <div onClick={() => navigate('/brightnessAndContrast')}>
              <Card title="Brightness and Contrast" bordered={true} hoverable>
                Users will be able to adjust the brightness and contrast of their photos to improve the overall look.
              </Card>
              </div>
            </Col>
          </Row>
        
        </div>
      </>
    );
  }


export default Home;
