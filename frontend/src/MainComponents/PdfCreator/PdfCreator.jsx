import React, { useState, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import "./PdfCreator.css";
import { Button, Layout, Menu, Spin } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import {toast} from 'react-toastify';
import {Fade} from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';

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

export const PdfCreator = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [cropperKey, setCropperKey] = useState(0);
  const [imageCollection, setImageCollection] = useState([]);  
  const [pdfUrl, setpdfUrl] = useState(null);
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);


  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleUpload = (file) => {
    let uniqueId = uuidv4();
    setfileName(file.name.split('.').slice(0, -1).join('.')+'_'+uniqueId);
    if (!(file instanceof Blob)) {
      console.log(file);
      console.error('Error: parameter is not a Blob object');
      //return;
    }

    const reader = new FileReader();
    const blob = new Blob([file], { type: file.type });

    reader.readAsDataURL(blob);
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };
  const handleDrop = (e) => {

    e.preventDefault();
    console.log(e);
    const check = e.dataTransfer.getData('image');
    const file = e.dataTransfer.items[3];
    console.log(file)
    if (file) {
      handleUpload(file);

    }
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
  }, []);  const props = {
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
  const handleClear = () => {
    setImageCollection([]);
  };
  const SiderImageUpload = (event) => {
    console.log(event.target.files);
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith('image/')) {
        console.log('Invalid file type');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageCollection((imageCollection) => [...imageCollection, event.target.result]);
      };

      reader.readAsDataURL(file);
    }
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
  
  
  function getDataOnUpload() {
    setIsLoading(true);
    const formData = new FormData();
    if(!(imageCollection.length > 0)){
      toast.error("Upload images.")
    }
    for(let i=0; i<imageCollection.length; i++) {
      let file = dataURItoFile(imageCollection[i], 'example'+i+'.jpg');
      formData.append('myfile', file);
    }
    formData.append('function', 'pdf_maker');
    axios.post(process.env.REACT_APP_API_URL+'/pdf_maker/', formData)
        .then(response => {
          setIsLoading(false);
          setpdfUrl(response.data['imageUrl']);
        })
        .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
      }


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <label style={{ color: 'white', textAlign: 'center' }}>Images:</label>
        <div style={{ position: "relative", width: "200px", height: "50px", }}>
          <button style={{ position: "absolute", width: "100%", height: "100%", }}>
            <i class="fa fa-plus-circle" aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></i>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => SiderImageUpload(e)}
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
      <div style={{marginLeft:'12%', marginTop:'10px', textAlign:'center'}}>
      <Button type="primary" onClick={getDataOnUpload} style={{ margin: '10px',backgroundColor:'#000524' }}>Create PDF</Button>
     
    {isLoading && <Spin indicator={antIcon} style={{position: 'absolute',
    height: '100%',
    width: '16%',
    top: '50%',
    left: '50%',
    margin: '-50px 0px 0px -50px'}}/>}
        { !pdfUrl ? 
        <Fade>
         <div style={{position:'relative'}}>
         <b>PDF Maker</b> involves creating photo collages by combining multiple images into a single composition using our intuitive collage maker.
         <ul>
           <li>Images : Upload images using the left panel.</li>
         <li>Create PDF: Use create pdf button for pdf.</li>
         
         <li>Output Image: Save the PDF to the local.</li>
         </ul>
         </div>  
         </Fade>
        :
        <iframe src={pdfUrl} width="100%" height="600px"></iframe>}

        </div>
    </Layout>
  );
};

export default PdfCreator;
