import React, { useState, useEffect} from "react";
import { Card, Upload, Button, Layout,Menu, Spin,Modal,Tooltip} from 'antd';
import './Mosaic.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import {Fade } from 'react-reveal';
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
    <Content>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

function Mosaic (props1) {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedLayout, setSelectedLayout] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
  const { uuid } = props1;
  const [imageUrls, setImageUrls] = useState([]);
  const [imageCollection, setImageCollection] = useState([]);
  const [imageCollection1, setImageCollection1] = useState([]);
  const [displayUrl, setDisplayUrl] = useState();
  const [isLoading,setIsLoading]= useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
 
  useEffect(() => {
    document.body.style.overflow = 'scroll';
  }, []);

  const SiderImageUpload = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith('image/')) {
        toast.error('Invalid file type');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageCollection((imageCollection) => [...imageCollection, event.target.result]);
      };

      reader.readAsDataURL(file);
    }
  };

  const SiderImageUpload1 = (event) => {
    const file= event.target.files[0];
      if (!file || !file.type.startsWith('image/')) {
        toast.error('Invalid file type');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageCollection1((imageCollection1) => [...imageCollection1, event.target.result]);
      };

      reader.readAsDataURL(file);
    
    setSelectedLayout(file);
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  useEffect(() => {
    const unloadHandler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', unloadHandler);
    return () => {
      window.removeEventListener('beforeunload', unloadHandler);
    };
  }, []);
  useEffect(() => {
    const unloadHandler = () => {
        setImageUrls([]);
    };
    window.addEventListener('unload', unloadHandler);
    return () => {
      window.removeEventListener('unload', unloadHandler);
    };
  }, []);
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  function dataURItoFile(dataURI, filename) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], {type: mimeString});
    return new File([blob], filename, {type: mimeString});
  }

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

  function handlePreview () {
    setIsLoading(true);
    const formData = new FormData();
    if(!imageCollection1[0]){
      setIsLoading(false);
      toast.error("Please upload template");
      return;
    }
    let file = dataURItoFile(imageCollection1[0], 'example0'+'.jpg');
    formData.append('myfile', file);
    if(imageCollection.length < 6){
      setIsLoading(false);
      toast.error("Please upload more than 6 images");
      return;
    }
    for(let i=0; i<imageCollection.length; i++) {
      let file = dataURItoFile(imageCollection[i], 'example'+(i+1)+'.jpg');
      formData.append('myfile_folder', file);
    }
    formData.append('function', 'mosaic_maker');
    axios.post(process.env.REACT_APP_API_URL+'/mosaic_maker/', formData)
        .then(response => {
          downloadImage(response.data.imageUrl);
        })
        .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
      }
  
  

  function handleDownload () {
    const link = document.createElement('a');
    link.href = displayUrl;
    link.setAttribute('download', 'image.png');
    document.body.appendChild(link);
    link.click();
    link.remove();
};
const handleClear = () => {
  setImageCollection([]);
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
    title: 'Mosaic',
    content: (
      <div>
       involves creating mosaic image by using multiple images.
 <ol>
 <li>Choose Template: Upload template using the left panel.</li>
 <li>Choose Images: Upload more than 6 images using right panel.</li>

   
   <li>Preview and Download: Preview and download the mosaic.</li>
 </ol>
      </div>
    ),
    onOk() {},
    width:600,
  });
};
  return (
    <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ height: '100vh', overflowY: 'scroll' }}>
        <label style={{ color: 'white', textAlign: 'center' }}>Template:</label>
        <Menu>
          {imageCollection1.map((image, index) => (
            <Menu.Item key={index} style={{ marginBottom: '10px', objectPosition: 'center center', height: '100%' }}>
            <img src={image} style={{ maxWidth: '100%', height: '100%' }} draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("image/jpeg", image);
              }} />
              <Button onClick={()=>{setImageCollection1([]);setSelectedLayout();setDisplayUrl()}} style={{backgroundColor:'#002140',color:'white',margin:'1rem 0rem 0rem 4rem'}}>
                    Clear
                  </Button>
          </Menu.Item>
          ))}
         
        </Menu>
        {!selectedLayout &&
        <div style={{ position: "relative", width: "200px", height: "50px", }}>
          <button style={{ position: "absolute", width: "100%", height: "100%", }}>
            <i class="fa fa-plus-circle" aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></i>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => SiderImageUpload1(e)}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: "0",
                left: "0",
                top: "0",
                cursor: "pointer",
              }}
            />
          </button>
        </div>}
      </Sider>
      <Layout className="site-layout">
        {(!imageCollection1.length > 0 || !imageCollection.length > 0) ?
        <div className="passport-photo-container" style={{display:'block'}}>
        <Fade>
           {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
           Please select the format and upload the image in box below. */}
           <div style={{position:'relative', left:'160px',top:'5rem'}}>
 <b>Mosaic</b> involves creating mosaic image by using multiple images.
 <ol>
 <li>Choose Template: Upload template using the left panel.</li>
 <li>Choose Images: Upload more than 6 images using right panel.</li>

   
   <li>Preview and Download: Preview and download the mosaic.</li>
 </ol>
 </div>  </Fade>
             <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
            <div style={{ flexGrow: '1' }}>
            {/* <Card
                className='passport-photo-card'
                title='Mosaic Will be displayed here'
                cover={displayUrl && <img className='uploaded-image' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
            >
               {isLoading && <Spin indicator={antIcon} />}
                <p className='ant-upload-text'>
                </p>
                <br />
                {(
                 <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                    Preview Photo
                  </Button>
                )}
                {displayUrl && (
                 <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                    Download Photo
                  </Button>
                )}
                {selectedFile && (
            <>
              <div style={{marginLeft:'25%', marginTop:'10px', textAlign:'center'}}>
              </div>
              
            </>
          )}            
            </Card> */}
            </div>
        </div>
        </div> 
        :
            <div className='passport-photo-container'>
            <div className='center-card-container'>
                <div style={{ flexGrow: '1' }}>
                <Card
                    className='passport-photo-card'
                    title='Mosaic Will be displayed here'
                    cover={displayUrl && <img className='uploaded-image' src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                    extra={
                      <Tooltip title="More Info">
                        <InfoCircleOutlined onClick={info} />
                      </Tooltip>
                    }
                >
                   {isLoading && <Spin indicator={antIcon} />}
                    <p className='ant-upload-text'>
                    </p>
                    <br />
                    {(
                     <Button type="primary" onClick={handlePreview} style={{ margin: '10px' }}>
                        Preview Photo
                      </Button>
                    )}
                    {displayUrl && (
                     <Button type="success" onClick={handleDownload} style={{ margin: '10px' }}>
                        Download Photo
                      </Button>
                    )}
                    {selectedFile && (
                <>
                  <div style={{marginLeft:'25%', marginTop:'10px', textAlign:'center'}}>
                  </div>
                  
                </>
              )}            
                </Card>
                </div>
            </div>
            </div>   }     
      </Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ height: '100vh', overflowY: 'scroll' }}>
        <label style={{ color: 'white', textAlign: 'center' }}>Images:</label>
        <div style={{ position: "relative", width: "200px",height:'50px' }}>
          <button style={{ width: "100%", height: "100%", }}>
            <i class="fa fa-plus-circle" aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></i>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={SiderImageUpload}
              onClick={(e) => e.target.value = null} 
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: "0",
                left: "0",
                top: "0",
                cursor: "pointer",
              }}
            />
          </button>
          
        </div>
        <button style={{ width: "100%" }} onClick={handleClear}>Clear</button>
        <Menu>
          {imageCollection.map((image, index) => (
            <Menu.Item key={index} style={{ marginBottom: '10px', objectPosition: 'center center', height: '100%' }}>
            <img src={image} style={{ maxWidth: '100%', height: '100%' }} draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData("image/jpeg", image);
              }} />
          </Menu.Item>         
          ))}
        </Menu>      
      </Sider>
    </Layout>
  );
}

export default Mosaic;