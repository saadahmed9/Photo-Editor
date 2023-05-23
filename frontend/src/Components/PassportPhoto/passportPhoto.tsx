import React, { useState,useEffect } from 'react';
import { Card, Upload, Button, Layout, Menu } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './passportPhoto.css';

const { Header, Sider, Content } = Layout;

const PassportPhoto = () => {
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>(null);

  const handleClear = () => {
    setImageUrl(null);
  };

  const handleUpload = (file: any) => {
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
    beforeUpload: (file: any) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        console.error('Only JPG/PNG files are allowed!');
        return false;
      }
      return true;
    },
    showUploadList: false,
    onChange: (info: any) => {
      if (info.file.status !== 'uploading') {
        handleUpload(info.file.originFileObj);
      }
    },
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
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
  }, []);
  return (
    <Layout>
      <Sider>
        <Menu theme="dark" mode="inline" style={{ minHeight:'100vh', overflow: 'hidden'}}>
          <Menu.Item key="1">United States</Menu.Item>
          <Menu.Item key="2">Canada</Menu.Item>
          <Menu.Item key="3">India</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <div className="passport-photo-container">
            <div className="center-card-container">
            <Card className="passport-photo-card"
                title="Drag and Drop Passport Photo"
                cover={imageUrl && <img className='uploaded-image' src={imageUrl as string} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
              >
                <Upload {...props}>
                  <p>
                    <UploadOutlined /> Click or drag passport photo to this area to upload
                  </p>
                </Upload><br></br>
                {imageUrl && (
                  <Button type="primary" onClick={handleClear}>
                    Clear Passport Photo
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PassportPhoto;
