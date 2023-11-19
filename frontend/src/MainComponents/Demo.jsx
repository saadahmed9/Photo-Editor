import React, { useState, useRef, useEffect } from "react";
import Cropper from "react-cropper";
import CropperCircle from "react-easy-crop";
import "cropperjs/dist/cropper.css";
import "./Demo.css";
import {
    Card, Upload, Button, Layout, Menu, Modal, Tooltip,
    Input, Row, Col
} from 'antd';
import { UploadOutlined, InfoCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { Fade } from 'react-reveal';
import { toast } from 'react-toastify';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import getCroppedImg from './cropImage'

const { Sider, Content } = Layout;

// Content section component
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

// Main Demo component
export const Demo = (props1) => {  

  // State variables
  const { uuid } = props1;
  const [imageSrc, setImageSrc] = useState('');
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [cropperKey, setCropperKey] = useState(0);
  const [cropData, setCropData] = useState("#");
  const [fileName, setfileName] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [fileType, setFileType] =useState(null);
  const [customRatio, setCustomRatio] = useState('');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)

  const cropperRef = useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }
  const [cropSize, setCropSize] = useState({
    width: 200,
    height: 200
  });
  const [isCircleCrop, setIsCircleCrop] = useState(false);

  
  // Handler for toggle between normal crop and circle crop
  const handleCropTypeToggle = () => {
    setIsCircleCrop(!isCircleCrop);
    setNumerator(''); // Reset custom ratio values when switching crop type
    setDenominator('');
    setCustomRatio('')
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  // Handler for custom ratio input change
  const handleInputChange = (e) => {
    setCustomRatio(e.target.value);
  };

  // Sidebar collapse handler
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };

  // Aspect ratio menu items
  const menuItems = [
    { key: '1', name: '16/9' },
    { key: '2', name: '1/1' },
    { key: '3', name: '4/3' },
    { key: '4', name: '3/4' },
  ];

  // Handler for aspect ratio menu item click
  const handleMenuClick = (event) => {
    const selectedAspectRatio = menuItems.find((item) => item.key === event.key)?.name;
    if (!isCircleCrop) {
      const [width, height] = selectedAspectRatio.split('/');
      setAspectRatio(parseFloat(width) / parseFloat(height));
    } else {
      // Handle circle crop ratio differently
      // You can set a fixed aspect ratio for the circle crop, like 1/1
      
      setAspectRatio(1);
    }
    setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
  };
  // Get cropped image data
  const getCropData = async () => {
    if(!isCircleCrop){
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
  }
  else{
    const cropper = cropperRef.current;

  if (!cropper) {
    return;
  }

  

  try {
    const croppedImage = await getCroppedImg(
      imageSrc, // Replace with the path to your image
      croppedAreaPixels,
      0 // Assuming rotation is 0, update accordingly
    );


    const formData = new FormData();
    formData.append('function', 'crop');
    formData.append('croppedImage', croppedImage); // Assuming croppedImage is a base64 encoded string

    axios.post(process.env.REACT_APP_API_URL + '/crop/', formData)
      .then(response => {
        // Handle successful response if needed
        console.log('Crop data sent successfully:', response.data);
      })
      .catch(error => {
        console.error('Error while sending crop data:', error);
        toast.error("Error encountered.");
      });


    console.log('done', { croppedImage });
    setCroppedImage(croppedImage);
    const link = document.createElement("a");
    link.download = fileName + "." + fileType;
    link.href = croppedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error while cropping:', error);
  }
  

  }
  };

  // Extract image type from MIME type
  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  // Handler for file upload
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

  // Handler for drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  // Add drag and drop event listener to document
  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

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

   // Modal info display
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
          <Sider width={220} style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>

              {collapsed ? (
                  <div className="photo-crop-cue">
                      <PictureOutlined style={{ fontSize: '32px', color: 'white', textAlign: 'center', marginTop: '20px' }} />
                      <div style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>Photo Crop</div>
                  </div>
              ) : (
                  <>
                      <label style={{ color: 'white', textAlign: 'center' }}>Choose Ratio:</label>
        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden', textAlign: 'center' }}
          onClick={(e) => handleMenuClick(e)}>
                              
            
            
            {isCircleCrop && (
                <div className="custom-ratio-container">
                <Input
                  className="custom-ratio-input"
                  placeholder="200"
                  value={customRatio}
                  onChange={(e) => setCustomRatio(e.target.value)}
                  style={{ marginRight: '0.5em' }} 
                />
                <span className="multiplication-sign" >×</span>
                <Input
                  className="custom-ratio-input"
                  placeholder="200"
                  value={customRatio} // Both text boxes have the same value for circle crop
                  onChange={(e) => setCustomRatio(e.target.value)}
                  style={{ marginLeft: '0.5em' }} 
                />
                </div>

              )}

                {isCircleCrop && (
                <Button
                  className="custom-ratio-button"
                  onClick={() => {
                    if (isNaN(customRatio) || customRatio == 0) {
                      console.error('Invalid ratio!');
                      return;
                    }
                    setCropSize({
                      width: parseFloat(customRatio),
                      height: parseFloat(customRatio)
                    });
                  }}
                >
                  Set Custom Ratio
                </Button>
              )}

            {!isCircleCrop && (
                      <div>
                        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '10vh', overflow: 'hidden', textAlign: 'center' }}
                                onClick={(e) => handleMenuClick(e)}>
                                      {menuItems.map((item) => (
                                          <Menu.Item className="ratio-menu-item" key={item.key}>{item.name}</Menu.Item>
                                      ))}
                      </Menu>
                      </div>
            )}



            {!isCircleCrop && (
              
                <div className="custom-ratio-container">
                  <Input
                    className="custom-ratio-input"
                    placeholder="Width"
                    value={numerator}
                    onChange={(e) => setNumerator(e.target.value)}
                    style={{ marginRight: '0.5em' }} 
                  />
                  <span>/</span>
                  <Input
                    className="custom-ratio-input"
                    placeholder="Height"
                    value={denominator}
                    onChange={(e) => setDenominator(e.target.value)}
                    style={{ marginLeft: '0.5em' }} 
                  />
                  
                  </div>
              )}

              {!isCircleCrop && (
                <Button
                  className="custom-ratio-button"
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
              )}



              <Button className="custom-ratio-button" onClick={() => handleCropTypeToggle()}>
                {isCircleCrop ? 'Switch to Normal Crop' : 'Switch to Circle Crop'}
              </Button>
            
        </Menu>
                  </>
              )}

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
                  <>
                  {isCircleCrop ? (
                    // Your new logic for circle crop
                    <CropperCircle
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      onCropChange={setCrop}
                      aspect={1}
                      objectFit="contain"
                      cropSize={cropSize}
                      cropShape="round"
                      zoomWithPinch={true}
                      onCropComplete={onCropComplete}
                      onZoomChange={onZoomChange}
                      style={{
                        containerStyle: {
                          height: "400px",
                          position: "relative",
                          margin: "auto",
                          width: "100%"
                        },
                      }}
                    />
                  ) : (
                    // Your existing logic for normal crop
                    <Cropper
                      key={cropperKey}
                      ref={cropperRef}
                      src={imageSrc}
                      aspectRatio={aspectRatio}
                      style={{ height: 400, width: '100%' }}
                      background={false}
                    />
                  )}
                </>
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
                    <>
                    {isCircleCrop ? (
                      // Your new logic for circle crop
                      <CropperCircle
                        image={imageSrc}
                        crop={crop}
                        onCropChange={setCrop}
                        aspect={1}
                        zoom={zoom}
                        objectFit="contain"
                        cropShape="round"
                        cropSize={cropSize}
                        onCropComplete={onCropComplete}
                        zoomWithPinch={true}
                        onZoomChange={onZoomChange}
                        style={{
                          containerStyle: {
                            height: "400px",
                            position: "relative",
                            margin: "auto",
                            width: "100%"
                          },
                        }}
                      />
                    ) : (
                      // Your existing logic for normal crop
                      <Cropper
                        key={cropperKey}
                        ref={cropperRef}
                        src={imageSrc}
                        aspectRatio={aspectRatio}
                        style={{ height: 400, width: '100%' }}
                        background={false}
                      />
                    )}
                  </>
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
