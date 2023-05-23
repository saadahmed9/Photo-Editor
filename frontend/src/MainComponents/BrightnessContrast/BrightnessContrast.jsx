import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Slider,Modal,Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './BrightnessContrast.css'
import { toast } from 'react-toastify';
import {Fade} from 'react-reveal';
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

function BrightnessContrast (props1) {
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState(); 
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [fileName, setfileName] = useState(null);

  const handleBrightnessChange = (value) => {
    setBrightness(value);
  };
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }; 

  const handleContrastChange = (value) => {
    setContrast(value);
  };
  const handleClear = () => {
    setImageUrl(null);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);let uniqueId = uuidv4();
    setfileName(file.name);
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
    if (!imageUrl) return;
    const formData = new FormData();
    formData.append('function', 'brightness_contrast');
      axios.post(process.env.REACT_APP_API_URL+'/brightness_contrast/', formData)
      .then(response => {
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered.");}); 

    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    };    
    toast.success("Successfully Processed");
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
  const info = () => {
    Modal.info({
      title: 'Brightness & Contrast',
      content: (
        <div>
          involves changing the brightness and contrast of image to improving the overall look.
    <ol>
    <li>Input Image: Start by drag & drop or upload the image file.</li>
    <li>Choose Brightness: Use slider in the left panel for brightness.</li>
    <li>Choose Contrast: Use slider in the left panel for contrast.</li>

      
      <li>Preview and Download: Preview and download the photo.</li>
    </ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
  };
    return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{backgroundColor: '#000524'}} collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div style={{ margin: 12 }}>Brightness</div>
          <Slider
            value={brightness}
            min={0}
            max={200}
            onChange={handleBrightnessChange}
            style={{ width: 175, margin:12 }}
          />
        <div style={{ margin: 12 }}>Contrast</div>
          <Slider
            value={contrast}
            min={0}
            max={200}
            onChange={handleContrastChange}
            style={{ width: 175, margin:12 }}
          />
        </Sider>
      <Layout className="site-layout">
        <ContentSection>
          {!imageUrl ? 
           <div className="passport-photo-container" style={{display:'block'}}>
           <Fade>
              {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
              Please select the format and upload the image in box below. */}
              <div style={{position:'relative', left:'160px',top:'5rem'}}>
    <b>Brightness & Contrast</b> involves changing the brightness and contrast of image to improving the overall look.
    <ol>
    <li>Input Image: Start by drag & drop or upload the image file.</li>
    <li>Choose Brightness: Use slider in the left panel for brightness.</li>
    <li>Choose Contrast: Use slider in the left panel for contrast.</li>

      
      <li>Preview and Download: Preview and download the photo.</li>
    </ol>
    </div>  </Fade>
                <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
             <div style={{flexGrow: '1'}}>
               <Card className="passport-photo-card"
                    title={
                     imageUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                   }
                   cover=
                     {
                       <div style={{ display: 'flex' }}>
                         {imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                         {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                   onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                       </div>  
                     }
                     extra={
                      <Tooltip title="More Info">
                        <InfoCircleOutlined onClick={info} />
                      </Tooltip>
                    }
                 >
                   <Upload {...props} className="my-upload">
                     <p>
                       <UploadOutlined /> Click or drag Photo to this area to upload
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
          :
          
        <div className="passport-photo-container">
            <div className="center-card-container">
              <div style={{flexGrow: '1'}}>
                <Card className="passport-photo-card"
                     title={
                      imageUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                    }
                    cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                    onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                        </div>  
                      }
                      extra={
                        <Tooltip title="More Info">
                          <InfoCircleOutlined onClick={info} />
                        </Tooltip>
                      }
                  >
                    <Upload {...props} className="my-upload">
                      <p>
                        <UploadOutlined /> Click or drag Photo to this area to upload
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
          </div>}
        </ContentSection>
      </Layout>
    </Layout>
  );
};

export default BrightnessContrast;