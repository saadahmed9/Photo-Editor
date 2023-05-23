import React, { useState, useEffect } from 'react';
import { Card, Upload, Button, Layout, Menu } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './passportPhoto.css';

const { Header, Sider, Content } = Layout;

const PassportPhoto = () => {
  const [imageUrl, setImageUrl] = useState();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const menuItems = [
    { key: '1', name: 'United States' },
    { key: '2', name: 'Canada' },
    { key: '3', name: 'India' },
  ];

  const handleMenuClick = (event) => {
    setSelectedCountry(event.key);
  };


  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const handleClear = () => {
    setImageUrl(null);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };

  const props = {
    name: 'file',
    accept: 'image/*',
    beforeUpload: (file) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        console.error('Only JPG/PNG files are allowed!');
        return false;
      }
      return true;
    },
    showUploadList: false,
    onChange: (info) => {
      if (info.file.status !== 'uploading') {
        handleUpload(info.file.originFileObj);
      }
    },
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleDownload = () => {
    console.log('Donwload Image');
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);  return (
    <Layout>
      <Sider style={{backgroundColor: '#000524'}}>
        <label style={{ color: 'white', textAlign: 'center' }}>Choose Country:</label>
          <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden', textAlign: 'center' }} onClick={handleMenuClick}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key}>{item.name}</Menu.Item>
          ))}        
        </Menu>      
      </Sider>
      <Layout>
        <Content>
          <div className="passport-photo-container">
            <div className="center-card-container">
              <div style={{flexGrow: '1'}}>
                <Card className="passport-photo-card"
                    title="Drag and Drop Passport Photo"
                    cover={imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                  >
                    <Upload {...props} className="my-upload">
                      <p>
                        <UploadOutlined /> Click or drag passport photo to this area to upload
                      </p>
                    </Upload><br></br>
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear}>
                        Clear Passport Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                     <Button type="primary" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Passport Photo
                      </Button>
                    )}
                </Card>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PassportPhoto;
