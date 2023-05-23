import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Menu,Spin,Modal,Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './FormatConversion.css';
import axios from 'axios';
import { toast } from "react-toastify";
import { LoadingOutlined } from '@ant-design/icons';
import {Fade}  from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';
import { InfoCircleOutlined } from '@ant-design/icons';



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
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function FormatConversion(props1) {
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState();
  const [displayUrl, setDisplayUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFormat, setselectedFormat] = useState(null);
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const menuItems = [
    { key: '1', name: 'JPG' },
    { key: '2', name: 'PNG' },
    { key: '3', name: 'JPEG' },
    { key: '4', name: 'SVG' },
    { key: '6', name: 'GIF' },
    {key:'7',name:'BMP'},
    {key:'8',name:'WEBP'},
    {key:'9',name:'HDR'},
    {key:'10',name:'PIC'},
    {key:'11',name:'EXR'}
  ];

  const handleMenuClick = (event) => {
    const selectedFormat = menuItems.find((item) => item.key === event.key)?.name;
    setselectedFormat(selectedFormat);
    console.log(selectedFormat)
  }; 


  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);    
    setDisplayUrl(null);
  };

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
  // async function urlToBlob(url) {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return blob;
  // }
  
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
  
  function dataURLtoFile(dataURL, fileName) {
    const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    const updatedDataURL = `data:image/png;base64,${base64Data}`;  
    const blob = dataURItoBlob(updatedDataURL);
    return new File([blob], fileName);
  }
  

  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  // function getImageTypeFromUrl(dataUrl) {
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
    axios.post(process.env.REACT_APP_API_URL+'/format_change/', formData)
      .then(response => {
        downloadImage(response.data.imageUrl, selectedFormat.toLowerCase())
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  }
  
  function handleDownload () {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', 'image.'+selectedFormat.toLowerCase());
        document.body.appendChild(link);
        link.click();
        link.remove();
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
      title: 'Format Conversion',
      content: (
        <div>
         involves changing the file format while preserving the visual content of the image:
<ol>
<li>Input Image: Start by drag & drop or upload the image file that needs to be converted.</li>

<li>Format Selection: Determine the desired output format, such as JPEG, PNG, or JPG.</li>

<li>Output Image: Save the newly encoded image data into a file with the desired output format.</li>
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
    <label style={{ color: 'white', textAlign: 'center' }}>Convert To:</label>
      <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524', minHeight: '100vh', overflow: 'hidden', textAlign: 'center' }} onClick={handleMenuClick}>
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ))}        
      </Menu>      
    </Sider>
      <Layout className="site-layout">
        <ContentSection>
          
        { !imageUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
       <Fade>
          {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
          <div style={{position:'relative', left:'160px',top:'5rem'}}>
<b>Format conversion</b> involves changing the file format while preserving the visual content of the image:
<ol>
<li>Input Image: Start by drag & drop or upload the image file that needs to be converted.</li>

<li>Format Selection: Determine the desired output format, such as JPEG, PNG, or JPG.</li>

<li>Output Image: Save the newly encoded image data into a file with the desired output format.</li>
</ol>
</div>  </Fade>
            <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
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
                        <UploadOutlined /> Click or drag passport photo to this area to upload
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
                        <UploadOutlined /> Click or drag passport photo to this area to upload
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