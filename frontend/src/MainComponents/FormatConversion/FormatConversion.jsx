// Imports from React and related libraries
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Imports from Ant Design
import {
    Card, Upload, Button, Layout, Menu, Spin, Modal, Tooltip
} from 'antd';
import {
    UploadOutlined, LoadingOutlined, InfoCircleOutlined, ArrowRightOutlined
} from '@ant-design/icons';

// CSS and other resources
import './FormatConversion.css';
import { toast } from "react-toastify";
import { Fade } from 'react-reveal';

// Configuration for loading icon
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
      color:'black'
    }}
    spin
  />
);

// Destructure Layout properties for easy use
const { Sider, Content } = Layout;

// Axios default configuration
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

// Component to encapsulate content section
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};


// Main component
function FormatConversion(props1) {
    // Destructure properties
    const { uuid } = props1;

    // State management using useState hooks
  const [imageUrl, setImageUrl] = useState();
  const [displayUrl, setDisplayUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFormat, setselectedFormat] = useState(null);
  const [isLoading,setIsLoading]= useState(false);
    const [fileName, setfileName] = useState(null);

    // Event handler for Sider collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };


    // Define possible formats for image conversion
  const menuItems = [
    { key: '1', name: 'JPG' },
    { key: '2', name: 'PNG' },
    { key: '3', name: 'JPEG' },
    { key: '4', name: 'HEIC' },
    { key: '6', name: 'GIF' },
    { key: '7', name: 'BMP' },
    { key: '8', name: 'WEBP' },
    { key: '9', name: 'HDR' },
    { key: '10', name: 'PIC'},
    { key: '11', name: 'HEIF'},
    { key: '12', name: 'TIFF' }
  ];


  // Handler to detect format menu click
  const handleMenuClick = (event) => {
    const selectedFormat = menuItems.find((item) => item.key === event.key)?.name;
    setselectedFormat(selectedFormat);
    console.log(selectedFormat)
  }; 

  // Clear the uploaded image
  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);    
    setDisplayUrl(null);
  };


  // Handle image uploads
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };


  // Properties for the Upload component
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


  // Drag and drop handling
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };
  // async function urlToBlob(url) {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return blob;
  // }


  // Convert Data URI to blob for image processing
  function dataURItoBlob(dataURI) {
    // Convert data URI to binary data
    const byteString = atob(dataURI.split(',')[1]);
  
    // Extract mime type
    const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    // Create ArrayBuffer object from binary data
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
  
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    // Create Blob object from ArrayBuffer
    return new Blob([ab], { type: mimeType });
  }


  // Convert Data URI to File object for easier handling
  function dataURLtoFile(dataURL, fileName) {
    const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    const updatedDataURL = `data:image/png;base64,${base64Data}`;  
    const blob = dataURItoBlob(updatedDataURL);
    return new File([blob], fileName);
  }
  

  // Get image type from MIME type in data URI
  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  // function getImageTypeFromUrl(dataUrl) {
  //   const extensionIndex = dataUrl.lastIndexOf(".");
  //   const extension = dataUrl.substring(extensionIndex + 1);
  //   return extension;
  // }


  // Download the processed image
  function downloadImage(url1,type) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
        //const url = window.URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          setIsLoading(false);
          const link = document.createElement('a');
        link.href = imageDataUrl;
        link.setAttribute('download', fileName+"."+selectedFormat.toLowerCase());
        document.body.appendChild(link);
        link.click();
        link.remove();
          //setDisplayUrl(imageDataUrl);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }


  // Handle preview button click
  function handlePreview () {
    setIsLoading(true);
    if(selectedFormat==null) {
      setIsLoading(false);
      toast.error("Select image format");
      return;
    }
    if(selectedFormat.toLowerCase() === getImageTypeFromMime(imageUrl)){
      setIsLoading(false);
      toast.error("Uploaded Image is already in the same format")
      return;
    }
    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(imageUrl,fileName+"."+ getImageTypeFromMime(imageUrl)));
    formData.append('format_change', selectedFormat.toLowerCase());
    formData.append('function', 'format_change');
    axios.post("http://xlabk8s3.cse.buffalo.edu:30014/format_change/", formData)
    //axios.post(process.env.REACT_APP_FORMAT_API_URL+'/format_change/', formData)
      .then(response => {
        downloadImage(response.data.imageUrl, selectedFormat.toLowerCase())
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }


  // Download the displayed image
  function handleDownload () {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', 'image.'+selectedFormat.toLowerCase());
        document.body.appendChild(link);
        link.click();
        link.remove();
  };


  // Prevent default drag over for custom drag and drop
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });


  // Attach drag and drop handlers using useEffect
  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Show information modal
  const info = () => {
    Modal.info({
      title: 'Format Conversion',
      content: (
        <div>
              Effortlessly transform its format while retaining the visual core.
<ol>
                  <li>Upload: Drag & drop or select the image you're aiming to convert.</li>

                  <li>Format Choice: Decide on your new format�JPEG, PNG, or JPG.</li>

                  <li>Finish: Download your image, redefined and ready.</li>
</ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
    };

    // Component render
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
                {collapsed ? (
                    <div className="collapsed-hint-container">
                        <UploadOutlined />
                        <p>Select Format</p>
                    </div>
                ) : (
                    <>
                        <label className="format-menu-label">Convert To:</label>
                        <Menu
                            theme="dark"
                            mode="inline"
                            style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden' }}
                            onClick={handleMenuClick}
                        >
                            {menuItems.map((item) => (
                                <Menu.Item
                                    key={item.key}
                                    className={`format-menu-item ${selectedFormat === item.name ? 'format-menu-item-selected' : ''}`}
                                >
                                    {item.name}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </>
                )}
            </Sider>
      <Layout className="site-layout">
        <ContentSection>
          
        { !imageUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
       <Fade>
          {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
          <div style={{position:'relative', left:'160px',top:'5rem'}}>
                                    <b>Format conversion</b> Transform the file type without altering the picture's essence:
<ol>
                                        <li>Upload: Drag & drop or click to select the image you want to convert.</li>

                                        <li>Choose Format: Pick your target format, be it JPEG, PNG, or JPG.</li>

                                        <li>Download: Grab your image in its fresh format.</li>
</ol>
</div>  </Fade>
            <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
              <div style={{flexGrow: '1'}}>
                  <Card className="passport-photo-card"
                      title={
                                            displayUrl ? "Uploaded Image and Result" : "Ready for a Format Flip?"
                      }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {/* {displayUrl && <img className='uploaded-image' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />} */}
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
                        <UploadOutlined /> Click or drag a photo to this area to upload
                      </p>
                      {isLoading && <Spin indicator={antIcon} />}
                    </Upload><br></br>
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )}
                    {/* {displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )} */}
                </Card>
              </div>
            </div>
          </div> :  
          <div className="passport-photo-container">
            <div className="center-card-container">
              <div style={{flexGrow: '1'}}>
                  <Card className="passport-photo-card"
                      title={
                        displayUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                      }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {/* {displayUrl && <img className='uploaded-image' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />} */}
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
                                                <UploadOutlined /> Drag & drop or tap to introduce your image
                      </p>
                      {isLoading && <Spin indicator={antIcon} />}
                    </Upload><br></br>
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )}
                    {/* {displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )} */}
                </Card>
              </div>
            </div>
          </div>}
        </ContentSection>
      </Layout>
    </Layout>
  );
};

export default FormatConversion;