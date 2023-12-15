// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Spin, Modal, Tooltip } from 'antd';
import { UploadOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './BackgroundRemoval.css';
import { ChromePicker } from "react-color";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';

// Loading spinner configuration
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
      color:'black'
    }}
    spin
  />
);

// Destructure Layout components
const { Sider, Content } = Layout;

// Content section component
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function BackgroundRemoval (props1) {
    const { uuid } = props1;

  // State for image, color, loading, etc.
  const [imageUrl, setImageUrl] = useState(); 
  const [color, setColor] = useState("#FFFFFF");
  const [displayUrl, setDisplayUrl] = useState(); 
  const [fileType, setFileType] =useState(null);
  const [fileName, setfileName] = useState(null);

  // Handle color picker change
  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
  };
  const [isLoading,setIsLoading]= useState(false);

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }; 

  // Clear all uploaded data
  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);
    setDisplayUrl(null);
    };

   // Extract image type from its data URL
  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
    }

  // Handle file upload
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.onload = () => {
      setImageUrl(reader.result);      
      setFileType(getImageTypeFromMime(reader.result));
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
    };

    // Handle file drop into the component
    const handleDrop = (e) => {
        e.preventDefault();

        if (!e.dataTransfer.files.length) {
            console.log('No files were dragged into the area.');
            return;
        }

        const file = e.dataTransfer.files[0];
        handleUpload(file);
    };

 // Disable default dragover event
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  // Configuration for the Upload component
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

   // Convert data URL to file object
  function dataURLtoFile(dataURL, fileName) {
    console.log('dataurl: ', dataURL, fileName);
    // extract the MIME type and base64 data from the URL
    const mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const data = atob(dataURL.split(',')[1]);
    // create a new blob from the binary data and MIME type
    const array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mime });
    const file = new File([blob], fileName, { type: mime });
    return file;
  }

  // function getImageType(dataUrl) {
  //   const extensionIndex = dataUrl.lastIndexOf(".");
  //   const extension = dataUrl.substring(extensionIndex + 1);
  //   return extension;
  // }

  function downloadImage(url1,type) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
        //const url = window.URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          setIsLoading(false);
          setDisplayUrl(imageDataUrl);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }

  // Send a POST request to change the background of the uploaded image
  function handlePreview () {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(imageUrl,fileName+"."+fileType));
    formData.append('background_change', color);
    formData.append('function', 'background_change');
    //axios.post(process.env.REACT_APP_BACKGROUND_CHANGE_API_URL+'/background_change/', formData)
    axios.post("http://xlabk8s3.cse.buffalo.edu:30015/background_change/", formData)
    
      .then(response => {
        downloadImage(response.data.imageUrl)
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }

  // Download the image with the modified background
  function handleDownload () {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', fileName+'.'+fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
  };


  // Add drag-drop event listener on component mount and remove it on unmount
  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Display an information modal
  const info = () => {
    Modal.info({
        title: 'Switch Up Your Scene:',
      content: (
        <div>
              Transform your image's background while keeping its main elements intact.
  <ol>
                  <li>Upload: Just drag & drop or select your image.</li>
                  <li>Backdrop Shade: Pick your desired color from the left panel.</li>
    
                  <li>Finish: Preview and grab your newly-styled photo.</li>
  </ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
    };

   // Render the component
  return (
    <Layout style={{ minHeight: "100vh" }}>
          <Sider className="sidebar" collapsible collapsed={collapsed} onCollapse={onCollapse}>
              {collapsed ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <Tooltip title="Choose Background Color">
                          <div style={{ width: '40px', height: '40px', backgroundColor: color, border: `3px solid ${color}` }} className="visual-cue-animation"></div>
                      </Tooltip>

                  </div>
              ) : (
                  <>
                          <label className="label" style={{ color: color, fontSize: '17px' }}>Choose Background Color:</label>
                      <ChromePicker color={color} onChange={handleColorChange} />
                  </>
              )}
          </Sider>

      <Layout className="site-layout">
      <ContentSection>
        {!imageUrl ? 
         <div className="passport-photo-container" style={{display:'block'}}>
         <Fade>
            {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
            Please select the format and upload the image in box below. */}
            <div style={{position:'relative', left:'160px',top:'5rem'}}>
                                  <b>Background Change</b> Switch out the background without losing your image's essence:
  <ol>
                                      <li>Upload: Drag & drop or click to select your image.</li>
                                      <li>Backdrop Color: Pick a shade from the left panel.</li>
    
                                      <li>See & Save: Preview then download your transformed photo.</li>
  </ol>
  </div>  </Fade>
              <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
           <div style={{flexGrow: '1'}}>
           <Card className="passport-photo-card"
                   title={
                                          displayUrl ? "Uploaded Image and Result" : "Ready to Change the Scene?"
                   }
                   cover=
                   {
                     <div style={{ display: 'flex' }}>
                       {imageUrl && <img className='uploaded-image' src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                       {displayUrl && <img className='uploaded-image' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
                                              <UploadOutlined /> Drag & drop or tap to upload your image
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
                     Preview Photo
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
       </div>
        :
        <div className="passport-photo-container">
            <div className="center-card-container" style={{width: '65%',maxWidth: '570px'}}>
              <div style={{flexGrow: '1'}}>
              <Card className="passport-photo-card"
                      title={
                        displayUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                      }
                      cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {imageUrl && <img className='uploaded-image' src={imageUrl} style={{marginRight: '25px',marginLeft: '15px',maxWidth: displayUrl ? '250px' : '100%', maxHeight: '100%',
        }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          
                          {displayUrl && <img className='uploaded-image' src={displayUrl}  style={{ maxWidth: '250px', maxHeight: '100%' }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
                      {isLoading && <Spin indicator={antIcon} />}
                    </Upload><br></br>
                    {imageUrl && (
                      <Button type="danger" onClick={handleClear} style={{ margin: '10px' }}>
                        Clear Photo
                      </Button>                     
                    )}
                    {imageUrl && (
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Preview Photo
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
          </div>}
        </ContentSection>
      </Layout>
    </Layout>
  );
};

export default BackgroundRemoval;