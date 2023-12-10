// Imports from React and related libraries
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Imports from Ant Design
import {
    Card, Upload, Button, Layout, Menu, Spin, Modal, Tooltip, Slider
} from 'antd';
import {
    UploadOutlined, LoadingOutlined, InfoCircleOutlined
} from '@ant-design/icons';

// CSS and other resources
import './ImageCompression.css';
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
function ImageCompression(props1) {
    // Destructure properties
    const { uuid } = props1;

    // State management using useState hooks
  const [imageUrl, setImageUrl] = useState();
  const [displayUrl, setDisplayUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFormat, setselectedFormat] = useState(null);
  const [compressionRate, setCompressionRate] = useState(50);
  const [target_size, setTarget_size] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [compressionMethod, setCompressionMethod] = useState('rate');
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);
  const [inputSize, setInputSize] = useState();
  const [outputSize, setOutputSize] = useState();
  
  
  //const handleInputChange1 = (event) => setTarget_size(event.target.value);
  const handleInputChange1 = (event) => {
    const inputValue = event.target.value;

    // If the input is empty, set the value to 0; otherwise, update with the input value
    setTarget_size(inputValue === null ? null : inputValue);
  };

    // Event handler for Sider collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };


    // Define possible formats for image compression
  const menuItems = [
    { key: '1', name: 'JPG' },
    { key: '2', name: 'JPEG' },
    { key: '3', name: 'PNG' }
  ];


  // Handler to detect format menu click
  const handleMenuClick = (event) => {
    const selectedFormat = menuItems.find((item) => item.key === event.key)?.name;
    setselectedFormat(selectedFormat);
    console.log(selectedFormat)
  }; 

  const handleMethodClick = (event) => {
    const selectedMethod = event.key;
    setCompressionMethod(selectedMethod);
    console.log(selectedMethod)

    if (selectedMethod === 'rate') {
      // Reset custom compression input value
      setTarget_size(null);
    } else if (selectedMethod === 'custom') {
      // Reset compression rate slider value
      setCompressionRate(50); // You can set it to your default value
    }

  }; 

  // Handle the compression rate change
    const handleSliderChange = (value) => {
      setCompressionRate(value);
      console.log(compressionRate)
    };

  // Clear the uploaded image
  const handleClear = () => {
    setIsLoading(false);
    setIsButtonClicked(false);
    setImageUrl(null);    
    setDisplayUrl(null);
    setInputSize(null);
    setOutputSize(null);
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

  function downloadImage(url1, format) {
    fetch(url1)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
              const imageDataUrl = reader.result;
                setIsLoading(false);
                setDisplayUrl(reader.result);
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.log(error);
            console.log("the reason is -------------------")
            toast.error("Error encountered.");
            setIsLoading(false);
        });
}



  // Handle preview button click
  function handlePreview () {
    setIsLoading(true);
    setIsButtonClicked(true); // Set button click state to true
    if(selectedFormat==null) {
      setIsLoading(false);
      setIsButtonClicked(false); // Reset button click state
      toast.error("Select image format");
      return;
    }

    const uploadedImageType = getImageTypeFromMime(imageUrl);
    if(selectedFormat.toLowerCase() === 'png' && uploadedImageType !== 'image/png') {
      setIsLoading(false);
      setIsButtonClicked(false); // Reset button click state
      toast.error("PNG output requires a PNG input. Please upload a PNG file.");
      return;
  }

    // if(selectedFormat.toLowerCase() === getImageTypeFromMime(imageUrl)){
    //   setIsLoading(false);
    //   toast.error("Uploaded Image is already in the same format")
    //   return;
    // }
    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(imageUrl,fileName+"."+ getImageTypeFromMime(imageUrl)));
    formData.append('output_format', selectedFormat.toLowerCase());
    formData.append('compression_rate', compressionRate);
    formData.append('function', 'image_compression');

    formData.append('custom_rate', target_size);
    axios.post("http://xlabk8s3.cse.buffalo.edu:30017/image_compression/", formData)
    
    //axios.post(process.env.REACT_APP_API_URL+'/image_compression/', formData)
      .then(response => {
        setInputSize(response.data.input_image_size);
        setOutputSize(response.data.output_image_size);
        downloadImage(response.data.imageUrl, selectedFormat.toLowerCase())
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)
      setIsButtonClicked(false); });
      
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
      title: 'Image Compression',
      content: (
        <div>
              Effortlessly compress image while maintaining great resolution.
<ol>
                  <li>Upload: Drag & drop or select the image you're aiming to compress.</li>

                  <li>Format Choice: Decide on your new compressed image format�JPEG, PNG, or JPG.</li>

                  <li>Finish: Download your image, compressed and ready.</li>
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
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)} // Assuming you have a setter function for the collapsed state
                style={{ backgroundColor: '#000524' }}
            >
                {/* When sidebar is collapsed, show only the visual cue */}
                {collapsed ? (
                    <div className="visual-cue-container">
                        <Tooltip title="Select File Format & Adjust Compression">
                            <span className="visual-cue">&#x1F50D;</span> {/* Example using a magnifying glass emoji */}
                        </Tooltip>
                    </div>
                ) : (
                <>

                            <div className="sidebar-content">
                            {!collapsed && (
                                <div className="compression-rate-slider-container">
                                    {compressionMethod === 'rate' && (
                                        <>
                                          <label className="compression-rate-label">Compression Rate:</label>
                                          {/* Assume you have a Slider component */}
                                          <Slider value={compressionRate} min={1} max={100} onChange={handleSliderChange} />
                                          <span>{compressionRate}</span>
                                        </>
                                      )}
                                      {compressionMethod === 'custom' && (
                                        <div className="input-container">
                                          <label style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>Compress Below (in KB):</label>
                                          <input type="text" value={target_size} onChange={handleInputChange1} placeholder="e.g. 300" />
                                        </div>
                                      )}
                                </div>
                            )}
                            
                                <Menu
                                theme="dark"
                                mode="inline"
                                style={{ backgroundColor: '#000524', minHeight: '15vh', overflow: 'hidden' }}
                                onClick={handleMethodClick}
                                defaultSelectedKeys={['rate']} 
                                >
                                <Menu.Item key="rate" className="format-menu-item" style={{ textAlign: 'center', backgroundColor: compressionMethod === 'rate' ? '#3750ed' : '#00093e', color: '#FFFFFF' }}>
                                  Compression Rate
                                </Menu.Item>
                                <Menu.Item key="custom" className="format-menu-item" style={{ textAlign: 'center', backgroundColor: compressionMethod === 'custom' ? '#3750ed' : '#00093e', color: '#FFFFFF' }}>
                                  Custom Compression
                                </Menu.Item>
                                </Menu>


                            <label className="format-menu-label">Compress As:</label>
                            
                            <Menu
                                theme="dark"
                                mode="inline"
                                style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden' }}
                                onClick={handleMenuClick}
                            >
                                
                                {menuItems.map((item) => (
                                  <Menu.Item
                                    key={item.key}
                                    className="format-menu-item"
                                    style={{
                                      textAlign: 'center',
                                      backgroundColor: selectedFormat === item.name ? '#3750ed' : '#00093e', // Blue if selected, else default color
                                      color: selectedFormat === item.name ? '#FFFFFF' : '#B4C2D3', // Text color for selected and non-selected items
                                    }}
                                  >
                                    {item.name}
                                  </Menu.Item>
                                ))}
                                
                                </Menu>
                                
                            </div>
                </>
                )}
            </Sider>
      <Layout className="site-layout">
        <ContentSection>
          
        { !imageUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
       <Fade>
          {/* Users can compress their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
          <div style={{position:'relative', left:'160px',top:'5rem'}}>
                                    <b>Image Compression</b> Compress images without compromising on their quality:
<ol>
                                        <li>Upload: Drag & drop or click to select the image you want to compress.</li>

                                        <li>Choose Format: Pick your target format, be it JPEG, PNG, or JPG.</li>

                                        <li>Download: Grab your compressed image in its fresh format.</li>
</ol>
        </div>  
        </Fade>
            <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
              <div style={{flexGrow: '1'}}>
                  <Card className="passport-photo-card"
                      title={
                                            displayUrl ? "Uploaded Image and Result" : "Upload your Image"
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
                    {inputSize && outputSize && (
                      <p> <b>Input File Size:</b> {inputSize} &emsp; &emsp; &emsp; <b>Output File Size:</b> {outputSize} </p>
                    )}
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
                    {displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )}
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
                    {inputSize && outputSize && (
                      <p> <b>Input File Size:</b> {inputSize} &emsp; &emsp; &emsp; <b>Output File Size:</b> {outputSize} </p>
                    )}
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                      <Button type="primary" onClick={handlePreview} style={{
                        margin: '10px',
                        backgroundColor: isButtonClicked ? 'blue' : null, // Change color to red if button is clicked
                    }}>
                          Preview Photo
                      </Button>
                      )}
                    {displayUrl && (
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

export default ImageCompression;
