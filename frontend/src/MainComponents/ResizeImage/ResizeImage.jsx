import React, { useState, useEffect} from "react";
import { Card, Upload, Button, Layout, Spin,Modal, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './ResizeImage.css'
import { toast } from 'react-toastify';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import {Fade } from 'react-reveal';
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

const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function ResizeImage (props1) {
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState(); 
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [fileType, setFileType] =useState(null);
  const [displayUrl, setDisplayUrl] = useState();
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);
  
  const handleInputChange1 = (event) => {
    setInput1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInput2(event.target.value);
  };

  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  }; 


  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);
  };
  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

  const handleUpload = (file) => {
    const reader = new FileReader();
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileType(getImageTypeFromMime(reader.result));
      setImageUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

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

  // function getImageType(dataUrl) {
  //   const extensionIndex = dataUrl.lastIndexOf(".");
  //   const extension = dataUrl.substring(extensionIndex + 1);
  //   return extension;
  // }

  function downloadImage(url1) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
       // const url = window.URL.createObjectURL(blob);
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
  
  function handleDownload () {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', fileName+'.'+fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Image Resize Successfully Completed"); 
  };

  async function handlePreview() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('myfile', dataURLtoFile(imageUrl, fileName + "." + fileType));
    formData.append('resize', input1.toString()+","+input2.toString());
    formData.append('function', 'resize');
    axios.post(process.env.REACT_APP_API_URL+'/resize/', formData)
      .then(response => {
        downloadImage(response.data.imageUrl)  
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
  };

  useEffect(() => {
    document.addEventListener('drop', handleDrop);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop);
    };
  }, []);
  const info = () => {
    Modal.info({
      title: 'Reseize Image',
      content: (
        <div>
         involves changing the overall size of the image.
 <ol>
 <li>Input Image: Start by drag & drop or upload the image file.</li>
 <li>Choose Width: Use textbox in the left panel for width.</li>
 <li>Choose Height: Use textbox in the left panel for height.</li>

   
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
      <Sider className="sidebar" collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <label className="labelx"  style={{ color: 'white' }}>Enter Width:</label>
      <input type="text" value={input1} onChange={handleInputChange1} />
      <label className="labely"style={{ color: 'white' }}>Enter Height:</label>
      <input type="text" value={input2} onChange={handleInputChange2} />
      </Sider>
      <Layout className="site-layout">
      <ContentSection>
        {!imageUrl ? 
        <div className="passport-photo-container" style={{display:'block'}}>
        <Fade>
           {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
           Please select the format and upload the image in box below. */}
           <div style={{position:'relative', left:'230px',top:'5rem'}}>
 <b>Resize Image</b> involves changing the overall size of the image.
 <ol>
 <li>Input Image: Start by drag & drop or upload the image file.</li>
 <li>Choose Width: Use textbox in the left panel for width.</li>
 <li>Choose Height: Use textbox in the left panel for height.</li>

   
   <li>Preview and Download: Preview and download the photo.</li>
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
                    {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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
      </div>
        :
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
                        {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
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

export default ResizeImage;