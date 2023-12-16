import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Imports from Ant Design
import {
    Card, Upload, Button, Layout, Spin, Modal, Tooltip, Menu, Slider
} from 'antd';
import {
    UploadOutlined, LoadingOutlined, InfoCircleOutlined
} from '@ant-design/icons';

// CSS and other resources
import './VideoCompression.css';
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

const { Sider, Content } = Layout;

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
function VideoCompression(props1) {
    // Destructure properties
    const { uuid } = props1;

    // State management using useState hooks
  const [videoUrl, setVideoUrl] = useState();
  const [displayUrl, setDisplayUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);
  const [inputSize, setInputSize] = useState();
  const [outputSize, setOutputSize] = useState();
  const [target_size, setTarget_size] = useState(null);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [method, setMethod] = useState(null);
  const [quality, setQuality] = useState(null);

    // Event handler for Sider collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };

  // Define possible video resolution formats 
  const menuItems = [
    { key: '1', name: '240p' },
    { key: '2', name: '360p' },
    { key: '3', name: '480p' },
    { key: '4', name: '720p' },
    { key: '5', name: '1080p' },
    { key: '6', name: '1440p' },
    { key: '7', name: '2160p' },
    { key: '8', name: '4320p' }
  ];

   // Handler to detect format menu click
   const handleMenuClick = (event) => {
    const selectedFormat = menuItems.find((item) => item.key === event.key)?.name;
    setSelectedAspect(selectedFormat);
    // console.log(selectedFormat)
  }; 
    
  const handleMethodClick = (event) => {
    const selectedMethod = event.key;
    setMethod(selectedMethod);
    // console.log(selectedMethod)

    if (selectedMethod === 'custom') {
      // Reset custom compression input value
      setSelectedAspect(null);
      setQuality(null);
    } else if (selectedMethod === 'aspect') {
      setQuality(50);
      setTarget_size(null);
    }

  }; 

  // Handle the compression rate change
  const handleSliderChange = (value) => {
    setQuality(value);
    // console.log(quality)
  };

  // Clear the uploaded Video
  const handleClear = () => {
    setIsLoading(false);
    setVideoUrl(null);    
    setDisplayUrl(null);
    setInputSize(null);
    setOutputSize(null);
    setTarget_size(null);
  };

  const handleInputChange1 = (event) => {
    const inputValue = event.target.value;

    // If the input is empty, set the value to 0; otherwise, update with the input value
    setTarget_size(inputValue === null ? null : inputValue);
  };

  // Handle video uploads
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.onload = () => {
        setVideoUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };


  // Properties for the Upload component
  const props = {
    name: 'file',
    accept: 'video/*',
    beforeUpload: (file) => {

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
    const base64Data = dataURL.replace(/^data:video\/\w+;base64,/, "");
    const updatedDataURL = `data:image/mp4;base64,${base64Data}`;  
    const blob = dataURItoBlob(updatedDataURL);
    return new File([blob], fileName);
  }
  

  // Get image type from MIME type in data URI
  function getVideoTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  // Download the processed image
  function downloadVideo(url1,type) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
        //const url = window.URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.onload = () => {
          const VideoDataUrl = reader.result;
          setIsLoading(false);
          setDisplayUrl(VideoDataUrl);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }

  function handleOutput() {
    setDisplayUrl(null);
    setOutputSize(null);
  };

    // Download the video 
  function handleDownload () {
    const link = document.createElement('a');
    link.href = displayUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
};


  // Handle preview button click
  function handlePreview () {
    setIsLoading(true);
    setDisplayUrl(null);
    setOutputSize(null);
    if (method === 'aspect' && selectedAspect === null ) {
      setIsLoading(false);
      toast.error("Select Video Resolution");
      return;
    }

    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(videoUrl,fileName+"."+ getVideoTypeFromMime(videoUrl)));
    // formData.append('format_change', selectedFormat.toLowerCase());
    formData.append('function', 'video_compression');
    formData.append('target', target_size);
    formData.append('resolution', selectedAspect);
    formData.append('quality', quality);
    // axios.post(process.env.REACT_APP_VIDEO_COMPRESSION_API_URL+'/video_compression/', formData)
    console.log(process.env.REACT_APP_VIDEO_COMPRESSION_API_URL)
    axios.post('http://xlabk8s3.cse.buffalo.edu:30018/video_compression/', formData)
      .then(response => {
        setInputSize(response.data.input_file_size);
        setOutputSize(response.data.output_file_size);
        downloadVideo(response.data.videoUrl)
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }

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
      title: 'Video Compression',
      content: (
        <div>
          Effortlessly compress video while maintaining great resolution.
          <ol>
            <li>Upload: Drag & drop or click to select the video you want to compress.</li>

            <li>Choose between 2 methods.
              <ul>
                <li style={{listStyle: 'disc'}}>Custom Compression - Compress Image to an approximate Target file size.</li>
                <li style={{listStyle: 'disc'}}>Video Resolution - Scale Video by selecting the resolution and adjusting the slider for video Quality (0 - worse quality; 100 - Lossless).</li>
              </ul>
            </li>
            <li>Select Compress Video to start compression process. Once Process is complete, the processed video is avaialble to be played in the page.</li>

            <li>Finish: Select Download Video to download the processed video file.</li>
          </ol>
          Note:
          <ol>
            <li style={{listStyle: 'disc'}}>Update any attributes and select Compress Video to restart the process with the Original Video.</li>
            <li style={{listStyle: 'disc'}}>Select Clear Output Video to clear the processed video.</li>
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
                        <Tooltip title="Adjust Compression">
                            <span className="visual-cue">&#x1F50D;</span> {/* Example using a magnifying glass emoji */}
                        </Tooltip>
                    </div>
                ) : (
                <>

                            <div className="sidebar-content">
                            {!collapsed && (
                                <div className="compression-rate-slider-container">
                                  {method === 'aspect' && (
                                        <>
                                          <label className="compression-rate-label">Resolution Quality:</label>
                                          <Slider value={quality} min={0} max={100} onChange={handleSliderChange} />
                                          <label className="compression-rate-label">Video Resolution:</label>
                                          <Menu
                                            theme="dark"
                                            mode="inline"
                                            style={{ backgroundColor: '#000524',overflow: 'hidden' }}
                                            onClick={handleMenuClick}
                                          >
                                            
                                            {menuItems.map((item) => (
                                              <Menu.Item
                                                key={item.key}
                                                className="format-menu-item"
                                                style={{
                                                  textAlign: 'center',
                                                  backgroundColor: selectedAspect === item.name ? '#3750ed' : '#00093e', // Blue if selected, else default color
                                                  color: selectedAspect === item.name ? '#FFFFFF' : '#B4C2D3', // Text color for selected and non-selected items
                                                }}
                                              >
                                                {item.name}
                                              </Menu.Item>
                                            ))}
                                            
                                            </Menu>                                      
                                        </>
                                      )}
                                      {method === 'custom' && (
                                        <div className="input-container">
                                          <label style={{ textAlign: 'center', display: 'block', margin: '0 auto' }}>Custom Compression (in MB):</label>
                                          <input type="number" value={target_size} onChange={handleInputChange1} placeholder="e.g. 300" title='Approximate value'/>
                                        </div>
                                      )}
                                </div>
                            )}

                              <Menu
                                theme="dark"
                                mode="inline"
                                style={{ backgroundColor: '#000524', minHeight: '15vh', overflow: 'hidden' }}
                                onClick={handleMethodClick}
                                defaultSelectedKeys={['custom']} 
                                >
                                <Menu.Item key="custom" className="format-menu-item" style={{ textAlign: 'center', backgroundColor: method === 'custom' ? '#3750ed' : '#00093e', color: '#FFFFFF' }}>
                                  Custom Compression
                                </Menu.Item>
                                <Menu.Item key="aspect" className="format-menu-item" style={{ textAlign: 'center', backgroundColor: method === 'aspect' ? '#3750ed' : '#00093e', color: '#FFFFFF' }}>
                                  Video Resolution
                                </Menu.Item>
                              </Menu>

                            </div>

                            
                </>
                )}
            </Sider>
      <Layout className="site-layout">
        <ContentSection>
          
        { !videoUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
       <Fade>
          <div style={{position:'relative', left:'160px',top:'5rem'}}>
          <b>Video Compression</b> Compress videos without compromising on their quality:
          <ol>
            <li>Upload: Drag & drop or click to select the video you want to compress.</li>

            <li>Choose between 2 methods.
              <ul>
                <li style={{listStyle: 'disc'}}>Custom Compression - Compress Image to an approximate Target file size.</li>
                <li style={{listStyle: 'disc'}}>Video Resolution - Scale Video by selecting the resolution and adjusting the slider for video Quality (0 - worse quality; 100 - Lossless).</li>
              </ul>
            </li>
            <li>Select Compress Video to start compression process. Once Process is complete, the processed video is avaialble to be played in the page.</li>

            <li>Finish: Select Download Video to download the processed video file.</li>
          </ol>
          Note:
          <ol>
            <li style={{listStyle: 'disc'}}>Update any attributes and select Compress Video to restart the process with the Original Video.</li>
            <li style={{listStyle: 'disc'}}>Select Clear Output Video to clear the processed video.</li>
          </ol>
</div>  </Fade>
            <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
              <div style={{flexGrow: '1'}}>
                  <Card className="passport-photo-card"
                      title={
                                            displayUrl ? "Uploaded video and Result" : "Upload your video"
                      }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {videoUrl && !displayUrl && <video className='uploaded-video' src={videoUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {displayUrl && <video className='uploaded-video' src={displayUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
                    {videoUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Video
                      </Button>                     
                    )}
                    {videoUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Compress Video
                      </Button>
                    )}
                    {displayUrl && (
                     <Button type="primary" onClick={handleOutput} style={{ margin: '10px' }}>
                        Clear Output Video
                      </Button>
                    )}
                    { displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Video
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
                        displayUrl ? "Uploaded Video and Result":"Drag and Drop Video"
                                              }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {videoUrl && !displayUrl && <video className='uploaded-video' src={videoUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {displayUrl && <video className='uploaded-video' src={displayUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
                                                <UploadOutlined /> Drag & drop or tap to introduce your video
                      </p>
                      {isLoading && <Spin indicator={antIcon} />}
                    </Upload><br></br>

                    {inputSize && outputSize && (
                      <p> <b>Input File Size:</b> {inputSize} &emsp; &emsp; &emsp; <b>Output File Size:</b> {outputSize} </p>
                    )}
                    {videoUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Video
                      </Button>                     
                    )}
                    {videoUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Compress Video
                      </Button>
                    )}
                    {displayUrl && (
                     <Button type="primary" onClick={handleOutput} style={{ margin: '10px' }}>
                        Clear Output Video
                      </Button>
                    )}
                    {displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Video
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

export default VideoCompression;