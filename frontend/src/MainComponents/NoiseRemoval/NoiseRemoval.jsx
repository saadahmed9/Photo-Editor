import React, { useState, useEffect } from "react";
import {
    Card, Upload, Button, Layout, Spin, Modal, Tooltip
} from 'antd';
import {
    UploadOutlined, LoadingOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';
import './NoiseRemoval.css'


// Constants
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
      color:'black'
    }}
    spin
  />
);
const { Content } = Layout;


// Content section layout
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function NoiseRemoval(props1) {

  // State declarations
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState(); 
  const [displayUrl, setDisplayUrl] = useState();
  const [fileType, setFileType] =useState(null);
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

  // Handle sidebar collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }; 


  // Clear uploaded and processed images
  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);
    setDisplayUrl(null);
    };

  // Get image type from DataURL
  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }


  // Handle image upload and set states
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.onload = () => {
      setFileType(getImageTypeFromMime(reader.result));
      setImageUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };

  // Handle file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });


  // Upload props for antd
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

  // Convert DataURL to File object
  function dataURLtoFile(dataURL, fileName) {
    const mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const data = atob(dataURL.split(',')[1]);
    const array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([array], { type: mime });
    const file = new File([blob], fileName, { type: mime });
    return file;
    }

  // Download image and set the processed image URL
  function downloadImage(url1,type) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
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

  // Send uploaded image for noise removal and fetch the processed image
  function handlePreview () {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(imageUrl,fileName+"."+fileType));
    formData.append('function', 'noise_removal');
    axios.post("http://xlabk8s3.cse.buffalo.edu:30013/noise_removal/", formData)
    // axios.post(process.env.REACT_APP_PDF_NOISE_BRIGHT_API_URL+'/noise_removal/', formData)
      .then(response => {
        downloadImage(response.data.imageUrl)
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }


  // Allow user to download the processed image
  function handleDownload () {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', fileName+'.'+fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
  };

  // Add event listeners for file drag and drop
  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    // Cleanup on component unmount
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  // Information modal
  const info = () => {
    Modal.info({
      title: 'Noise Removal',
      content: (
        <div>
              Target noise and distortions to produce a sharper, clearer picture.
  <ol>
                  <li>Upload: Drag & drop or select the image craving clarity.</li>
    
                  <li>Result: Preview and capture your noise-free masterpiece.</li>
  </ol>
        </div>
      ),
      onOk() {},
      width:600,
    });
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
      <ContentSection>
        { !imageUrl ? 
         <div className="passport-photo-container" style={{display:'block'}}>
         <Fade>
            {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
            Please select the format and upload the image in box below. */}
            <div style={{position:'relative', left:'200px',top:'5rem'}}>
                                  <b>Noise Removal</b> Eliminate noise and distortions for a pristine finish:
  <ol>
                                      <li>Upload: Drag & drop or click to select your image.</li>
    
                                      <li>Download: Preview your refined photo and save it.</li>
  </ol>
  </div>  </Fade>
              <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
           <div style={{flexGrow: '1'}}>
             <Card className="passport-photo-card"
                  title={
                                          displayUrl ? "Uploaded Image and Result" : "Ready to Clear the Haze?"
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
                                              <UploadOutlined /> Drag & drop or tap to start your clarity journey.
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
            <div className="center-card-container" style={{width: '65%',maxWidth:"700px"}}>
              <div style={{flexGrow: '1'}}>
                <Card className="passport-photo-card"
                     title={
                      displayUrl ? "Uploaded Image and Result":"Drag and Drop Photo"
                    }
                    cover=
                      {
                        <div style={{ display: 'flex' }}>
                          {imageUrl && <img className='uploaded-image' style={{marginRight: '35px',marginLeft: '25px',maxWidth: displayUrl ? '300px' : '100%', maxHeight: '100%',}} src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                          {displayUrl && <img className='uploaded-image' src={displayUrl} style={{ maxWidth: '300px', maxHeight: '100%' }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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

export default NoiseRemoval;