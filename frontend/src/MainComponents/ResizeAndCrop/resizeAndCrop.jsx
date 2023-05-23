import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Menu } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../PassportPhoto/passportPhoto.css';
import ReactCrop,{Crop} from "react-image-crop";

const { Sider, Content } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const menuItems = [
    { key: '1', name: 'United States' },
    { key: '2', name: 'Canada' },
    { key: '3', name: 'India' },
  ];

  const handleMenuClick = (event) => {
    const aspectRatio = menuItems.find((item) => item.key === event.key)?.name;
    setAspectRatio(aspectRatio);
    console.log(aspectRatio)
  }; 

  return (
    <Sider style={{backgroundColor: '#000524'}} collapsible collapsed={collapsed} onCollapse={onCollapse}>
    <label style={{ color: 'white', textAlign: 'center' }}>Choose Ratio:</label>
      <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden', textAlign: 'center' }} onClick={handleMenuClick}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ))}        
    </Menu>      
  </Sider>
  );
};

const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function ResizeAndCrop (props1) {
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState();
  const [crop, setCrop] = useState<ReactCrop.Crop>({ aspect: 16 / 9 })
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <ContentSection>
        <div className="passport-photo-container">
            <div className="center-card-container">
              <div style={{flexGrow: '1'}}>
                <Card className="passport-photo-card"
                    title="Drag and Drop Photo"
                    cover={imageUrl && 
                        <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                        <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />
                        </ReactCrop>
                    }>
                    <Upload {...props} className="my-upload">
                      <p>
                        <UploadOutlined /> Click or drag photo to this area to upload
                      </p>
                    </Upload><br></br>
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear}>
                        Clear Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                     <Button type="primary" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )}
                </Card>
              </div>
            </div>
          </div>
        </ContentSection>
      </Layout>
    </Layout>
  );
};

export default ResizeAndCrop;