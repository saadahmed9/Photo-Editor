// Importing necessary libraries and components
import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Slider, Modal, Tooltip } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './BrightnessContrast.css';
import { toast } from 'react-toastify';
import { Fade } from 'react-reveal';
import axios from 'axios';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const { Sider, Content } = Layout;


// ContentSection Component - A wrapper for content
const ContentSection = ({ children }) => {
    return (
        <Content style={{ padding: "0 50px" }}>
            <div className="site-layout-content">{children}</div>
        </Content>
    );
};

// BrightnessContrast Component
function BrightnessContrast(props1) {

    const { uuid } = props1;

    // State management for the component
    const [imageUrl, setImageUrl] = useState();
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [fileName, setfileName] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    // Handlers for the Brightness and Contrast adjustments
    const handleBrightnessChange = (value) => setBrightness(value);
    const handleContrastChange = (value) => setContrast(value);
    const onCollapse = (collapsed) => setCollapsed(collapsed);
    const handleClear = () => setImageUrl(null);


  // Handler for image upload
    const handleUpload = useCallback((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Only one read operation
        setfileName(file.name);
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.onerror = (error) => {
            console.error('Error: ', error);
        };
    }, [setfileName, setImageUrl]);
 // Here you should include any dependencies this function relies on

  // Upload properties
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


  // Handling drag & drop of image files
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleUpload(file);
    }, [handleUpload]);

  // Function to download the processed image
  const handleDownload = () => {
    if (!imageUrl) return;
    const formData = new FormData();
    formData.append('function', 'brightness_contrast');
    //axios.post(process.env.REACT_APP_PDF_NOISE_BRIGHT_API_URL +'/brightness_contrast/', formData)
    axios.post("http://xlabk8s3.cse.buffalo.edu:30013/brightness_contrast/", formData)
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


  // Disabling the default dragover event behavior
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });


  // Adding and removing drop event listeners
    useEffect(() => {
        document.addEventListener('drop', handleDrop);

        // Remove event listener when component is unmounted
        return () => {
            document.removeEventListener("drop", handleDrop);
        };
    }, [handleDrop]); 



  // Modal to show information about Brightness & Contrast
  const info = () => {
    Modal.info({
        title: 'Image Enhancement:',
      content: (
        <div>
              Quickly refine the look of your photo by adjusting its brightness and contrast.
    <ol>
                  <li>Upload: Simply drag & drop or add your image.</li>
                  <li>Brightness: Use the slider on the left to set the right brightness.</li>
                  <li>Contrast: Adjust with the slider on the left for perfect contrast.</li>

      
                  <li>Ready? Preview and download your improved photo.</li>
    </ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
    };

    // Rendering the component
    return (
    <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="slider-container">
                    {collapsed ? (
                        <div className="collapsed-icon-container">
                            <Tooltip title={`Brightness is ${brightness}%`}>
                                <div className="collapsed-icon">
                                    B
                                </div>
                            </Tooltip>
                            <Tooltip title={`Contrast is ${contrast}%`}>
                                <div className="collapsed-icon">
                                    C
                                </div>
                            </Tooltip>
                        </div>
                    ) : (
                        <>
                            <div style={{ margin: 12,fontWeight:"bold", color:"white"}}>Brightness</div>
                            <Slider
                                value={brightness}
                                min={0}
                                max={200}
                                onChange={handleBrightnessChange}
                                style={{ width: 175, margin: 12 }}
                            />
                            <div style={{ margin: 12,fontWeight:"bold", color:"white" }}>Contrast</div>
                            <Slider
                                value={contrast}
                                min={0}
                                max={200}
                                onChange={handleContrastChange}
                                style={{ width: 175, margin: 12 }}
                            />
                        </>
                    )}
                </div>
            </Sider>




      <Layout className="site-layout">
                <ContentSection>
                    {/* Rendering either the instruction or the image based on whether an image has been uploaded */}
          {!imageUrl ? 
           <div className="passport-photo-container" style={{display:'block'}}>
           <Fade>
              {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
              Please select the format and upload the image in box below. */}
              <div style={{position:'relative', left:'160px',top:'5rem'}}>
                <b>Enhance Your Image</b> Adjust brightness & contrast for a perfect look:
    <ol>
                                        <li>Upload: Drag & drop or click to add your image.</li>
                                        <li>Brightness: Slide to adjust on the left panel.</li>
                                        <li>Contrast: Fine-tune using the slider on the left.</li>
                                        <li>Finalize: Download your enhanced photo.</li>
    </ol>
    </div>  </Fade>
                <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
             <div style={{flexGrow: '1'}}>
               <Card className="passport-photo-card"
                    title={
                                            imageUrl ? "Uploaded Image and Result" : "Upload Your Image"
                   }
                   cover=
                     {
                       <div style={{ display: 'flex' }}>
                         {imageUrl && <img className='uploaded-image' alt="Uploaded" src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                         {imageUrl && <img className='uploaded-image' alt="Processed" id="image" src={imageUrl} style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
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
                       <UploadOutlined /> Drag & drop or click to add your image

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
            <div className="center-card-container" style={{maxWidth:"400px"}}>
              <div style={{flexGrow: '1',width:'600px'}}>
                <Card className="passport-photo-card"
                     title={
                      imageUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                    }
                    cover=
                      {
                        <div style={{ display:'flex' ,width:'550px'}}>
                            {imageUrl && <img className='uploaded-image' src={imageUrl}  style={{marginRight: '25px',marginLeft: '20px',width: '240px', height: '200px',}} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} alt="Uploaded" />}
                            {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} style={{ width: '240px', height: '200px', filter: `brightness(${brightness}%) contrast(${contrast}%)` }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} alt="Adjusted Brightness and Contrast" />}
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