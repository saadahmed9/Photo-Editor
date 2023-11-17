import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Imports from Ant Design
import {
    Card, Upload, Button, Layout, Spin, Modal, Tooltip
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
//   const [selectedFormat, setselectedFormat] = useState(null);
  const [isLoading,setIsLoading]= useState(false);
    const [fileName, setfileName] = useState(null);

    // Event handler for Sider collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };

  // Clear the uploaded Video
  const handleClear = () => {
    setIsLoading(false);
    setVideoUrl(null);    
    setDisplayUrl(null);
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
          const link = document.createElement('a');
        link.href = VideoDataUrl;
        link.setAttribute('download', fileName);
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

    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(videoUrl,fileName+"."+ getVideoTypeFromMime(videoUrl)));
    // formData.append('format_change', selectedFormat.toLowerCase());
    formData.append('function', 'video_compression');
    axios.post(process.env.REACT_APP_API_URL+'/video_compression/', formData)
      .then(response => {
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
                  <li>Upload: Drag & drop or select the video you're aiming to compress.</li>

                  <li>Finish: Download your video, compressed and ready.</li>
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
                        <Tooltip title="">
                            <span className="visual-cue">&#x1F50D;</span> {/* Example using a magnifying glass emoji */}
                        </Tooltip>
                    </div>
                ) : (
                <>
                </>
                )}
            </Sider>
      <Layout className="site-layout">
        <ContentSection>
          
        { !videoUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
       <Fade>
          {/* Users can compress their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
          <div style={{position:'relative', left:'160px',top:'5rem'}}>
                                    <b>Video Compression</b> Compress videos without compromising on their quality:
<ol>
                                        <li>Upload: Drag & drop or click to select the video you want to compress.</li>

                                        <li>Finish: Download your video, compressed and ready.</li>
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
                          {videoUrl && <video className='uploaded-video' src={videoUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {/* {displayUrl && <img className='uploaded-video' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />} */}
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
                    {videoUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Video
                      </Button>                     
                    )}
                    {videoUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Compress & Download Video
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
                        displayUrl ? "Uploaded Video and Result":"Drag and Drop Video"
                      }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {videoUrl && <video className='uploaded-video' src={videoUrl} controls={true} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
                                                <UploadOutlined /> Drag & drop or tap to introduce your video
                      </p>
                      {isLoading && <Spin indicator={antIcon} />}
                    </Upload><br></br>
                    {videoUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Video
                      </Button>                     
                    )}
                    {videoUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Compress & Download Video
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

export default VideoCompression;