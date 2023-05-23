import React, { useState, useRef,useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Demo.css";
import { Card, Upload, Button, Layout, Menu ,Modal, Tooltip,Input, Row, Col} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {Fade} from 'react-reveal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { InfoCircleOutlined } from '@ant-design/icons';


const { Sider, Content } = Layout;


const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

export const Demo = (props1) => {  
  const { uuid } = props1;
  const [imageSrc, setImageSrc] = useState('');
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [cropperKey, setCropperKey] = useState(0);
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState("#");
  const [fileName, setfileName] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [fileType, setFileType] =useState(null);
  const [customRatio, setCustomRatio] = useState('');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');

  const handleInputChange = (e) => {
    setCustomRatio(e.target.value);
  };
  
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const menuItems = [
    { key: '1', name: '16/9' },
    { key: '2', name: '1/1' },
    { key: '3', name: '4/3' },
    { key: '4', name: '3/4' },
  ];

  const handleMenuClick = (event) => {
    const selectedAspectRatio = menuItems.find((item) => item.key === event.key)?.name;
    const [width, height] = selectedAspectRatio.split('/');
    setAspectRatio(parseFloat(width) / parseFloat(height));
    setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
  };



  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      const formData = new FormData();
    formData.append('function', 'crop');
      axios.post(process.env.REACT_APP_API_URL+'/crop/', formData)
      .then(response => {
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered.");});  
      setCropData(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL());
      const croppedImage = cropperRef.current?.cropper?.getCroppedCanvas().toDataURL();
      const link = document.createElement("a");
      link.download = fileName + "." + fileType;
      link.href = croppedImage;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  };

  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  const handleUpload = (file) => {
    const reader = new FileReader();
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setFileType(getImageTypeFromMime(reader.result));
      setCropperKey(cropperKey + 1); // reset the Cropper component with a new key

    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };
  const handleDrop = (e) => {
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
  }, []);  const props = {
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
  const info = () => {
    Modal.info({
      title: 'Photo Crop',
      content: (
        <div>
          involves removing unwanted areas and keeping the desired elements.
  <ol>
  <li>Input Image: Start by drag & drop or upload the image file.</li>
  
  <li>Choose Ratio: Select the desired aspect ratio from the left panel.</li>
  <li>Set Custom Ratio by entering values.</li>
  <li>Preview and Download: Preview and download the cropped photo.</li>
  </ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <label style={{ color: 'white', textAlign: 'center' }}>Choose Ratio:</label>
        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden', textAlign: 'center' }}
          onClick={(e) => handleMenuClick(e)}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} >{item.name}</Menu.Item>
          ))}
         <Row gutter={16} align="middle" justify="center">
  <Col span={10} style={{paddingLeft:'0px', position:'relative', left:'-5px',bottom:'4px'}}>
    <Input 
      style={{ width: '30px' }} 
      placeholder="Width" 
      value={numerator} 
      onChange={(e) => setNumerator(e.target.value)} 
    />
  </Col>
  <Col style={{position:'relative', left:'2px'}}>
   / 
  </Col>
  <Col span={10} style={{paddingLeft:'0px', position:'relative', left:'-5px', bottom:'4px'}}>
    <Input 
      style={{ width: '30px', position:'relative', right:'14px' }} 
      placeholder="Height" 
      value={denominator} 
      onChange={(e) => setDenominator(e.target.value)} 
    />
  </Col>
  <Col span={6}>
    
  </Col>
</Row>
<Button
      style={{ marginLeft: '10px' }}
      onClick={() => {
        if (isNaN(numerator) || isNaN(denominator) || denominator == 0) {
          console.error('Invalid ratio!');
          return;
        }
        setAspectRatio(parseFloat(numerator) / parseFloat(denominator));
        setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
      }}
    >
      Set Custom Ratio
    </Button>



        </Menu>
       

      </Sider>
      <Layout className="site-layout">
        <ContentSection>
          {!imageSrc ? 
         <div className="passport-photo-container" style={{display:'block'}}>
         <Fade>
            <div style={{position:'relative', left:'180px',top:'5rem'}}>
  <b>Photo Crop</b> involves removing unwanted areas and keeping the desired elements.
  <ol>
  <li>Input Image: Start by drag & drop or upload the image file.</li>
  
  <li>Choose Ratio: Select the desired aspect ratio from the left panel.</li>
  <li>Set Custom Ratio by entering values.</li>
  
  <li>Preview and Download: Preview and download the cropped photo.</li>
  </ol>
  </div>  </Fade>
              <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
            <div style={{ flexGrow: '1' }}>
              <Card className="passport-photo-card"
                title="Drag and Drop Photo"
                cover={imageSrc && (
                  <Cropper
                    key={cropperKey} // reset the Cropper component with a new key
                    ref={cropperRef}
                    src={imageSrc}
                    aspectRatio={aspectRatio}
                    style={{ height: 400, width: '100%' }}
                    background={false}
                  />
                )}
                // {imageSrc && <img className='uploaded-image' src={imageSrc} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                extra={
                  <Tooltip title="More Info">
                    <InfoCircleOutlined onClick={info} />
                  </Tooltip>
                }
              >
                <Upload {...props} className="my-upload">
                  <p>
                    <UploadOutlined /> Click or drag photo to this area to upload
                  </p>
                </Upload><br></br>
                {imageSrc && (
                <div style={{ width: '50%', marginTop: '10px' , marginLeft:'130px'}}>
                <Button type="danger" onClick={() => setImageSrc(null)}>
                  Clear Photo
                </Button>
                <Button type="primary" style={{margin: '10px' }} onClick={() => getCropData()}>
                  Download Photo
                </Button>
              </div>
              )}
              </Card>
              {/* <input type="file" onChange={handleFileChange} /> */}
              
              
            </div>
          </div>
        </div>
          : 
          <div className="passport-photo-container">
            <div className="center-card-container">
              <div style={{ flexGrow: '1' }}>
                <Card className="passport-photo-card"
                  title="Drag and Drop Photo"
                  cover={imageSrc && (
                    <Cropper
                      key={cropperKey} // reset the Cropper component with a new key
                      ref={cropperRef}
                      src={imageSrc}
                      aspectRatio={aspectRatio}
                      style={{ height: 400, width: '100%' }}
                      background={false}
                    />
                  )}
                  // {imageSrc && <img className='uploaded-image' src={imageSrc} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                  extra={
                    <Tooltip title="More Info">
                      <InfoCircleOutlined onClick={info} />
                    </Tooltip>
                  }
                >
                  <Upload {...props} className="my-upload">
                    <p>
                      <UploadOutlined /> Click or drag photo to this area to upload
                    </p>
                  </Upload><br></br>
                  {imageSrc && (
                  <div style={{ width: '50%', marginTop: '10px' , marginLeft:'130px'}}>
                  <Button type="danger" onClick={() => setImageSrc(null)}>
                    Clear Photo
                  </Button>
                  <Button type="primary" style={{margin: '10px' }} onClick={() => getCropData()}>
                    Download Photo
                  </Button>
                </div>
                )}
                </Card>
                {/* <input type="file" onChange={handleFileChange} /> */}
                
                
              </div>
            </div>
          </div>}
        </ContentSection>
      </Layout>
    </Layout>



  );
};

export default Demo;
