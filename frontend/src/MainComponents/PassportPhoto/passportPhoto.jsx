import React, { useState, useRef, useEffect } from "react";
import { Card, Upload, Button, Layout, Spin,Modal, Tooltip  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './passportPhoto.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cropper from "react-cropper";
import { Select } from 'antd';
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
const { Option } = Select;
const { Sider, Content } = Layout;
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

const PassportPhoto = (props1) => {  
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [cropperKey, setCropperKey] = useState(0);
  const cropperRef = useRef(null);
  const [fileType, setFileType] =useState(null);
  const [displayUrl, setDisplayUrl] = useState();
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const menuItems = [
    { key: '1', name: 'Brazil' },
{ key: '2', name: 'Canada' },
{ key: '3', name: 'China' },
{ key: '4', name: 'France' },
{ key: '5', name: 'France' },
{ key: '6', name: 'Germany' },
{ key: '7', name: 'India' },
{ key: '8', name: 'Italy' },
{ key: '9', name: 'Japan' },
{ key: '10', name: 'Korea' },
{ key: '11', name: 'Mexico' },
{ key: '12', name: 'Netherlands' },
{ key: '13', name: 'Russia' },
{ key: '14', name: 'Singapore' },
{ key: '15', name: 'Spain' },
{ key: '16', name: 'Turkey' },
{ key: '17', name: 'United Kingdom' },
{ key: '18', name: 'United States' }
  ];
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleMenuClick = (value) => {
    const selectedCountry = menuItems.find((item) => item.key === value)?.name;
    setSelectedCountry(selectedCountry);
    console.log(selectedCountry)
  }; 

  const handleClear = () => {
    setIsLoading(false);
    setImageUrl(null);
    setDisplayUrl(null);
  };

  function getImageTypeFromMime(dataUrl) {    
    return  dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
  }

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
  function dataURLtoFile(dataURL, fileName) {
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
  //   console.log(dataUrl)
  //   console.log("image type is :", dataUrl.split(',')[0].split(':')[1].split(';')[0]);
  //   return dataUrl.split(',')[0].split(':')[1].split(';')[0];
  // }
  
  function downloadImage(url1,type) {
    fetch(url1)
      .then(response => response.blob())
      .then(blob => {
        //const url = window.URL.createObjectURL(blob);
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result;
          toast.success("Successfully processed")
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
        link.setAttribute('download', fileName + '.'+fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Passport photo Successfully created");  
  };

  const handlePreview = async () => {
    setIsLoading(true);
    if(selectedCountry == null){
      setIsLoading(false);
      toast.error("Please select country");
      return;
    }
    if (typeof cropperRef.current?.cropper !== "undefined") {
      //setImageUrl(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL());
      console.log("image url:", imageUrl);
      console.log(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL())
      const formData = new FormData();
      formData.append('myfile', dataURLtoFile(cropperRef.current?.cropper?.getCroppedCanvas().toDataURL(),fileName+'.'+fileType));
      formData.append('country', selectedCountry);
      formData.append('function', 'passport_photo_size');
      if(isChecked){        
      formData.append('background_req', 'yes');
      }else{
        formData.append('background_req', 'no');
      }
      axios.post(process.env.REACT_APP_API_URL+'/passport_photo_size/', formData)
        .then(response => {
          console.log(response)
          if(response.data['face detection'].includes("No")){
            setIsLoading(false);
            toast.error(response.data['face detection']);
            return;
          }
          if(response?.data?.Spects_detector && !response.data['Spects_detector'].includes("not detected")){
            setIsLoading(false);
            var answer = window.confirm(response.data.Spects_detector + ", Do you want to continue download?");
            if (!answer) {
                toast.error('Please re-upload image');
                handleClear();
                return;
            }
          }
          if(response?.data['pose detector'] && response.data['pose detector'].includes("TILT")  ){
            var answer = window.confirm("Face is tilted, Do you want to continue with existing image?");
            if (!answer) {
                toast.error('Please re-upload image');
                handleClear();
                return;
            }
          }
          downloadImage(response.data.imageUrl); 
        }
        )
        .catch(error => {console.log(error); toast.error("Error encountered."); setIsLoading(false)});     
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
  }, []);  
  const info = () => {
    Modal.info({
      title: 'Passport Photo Creation',
      content: (
        <div>
          involves creating a passport photo that meets the specific requirements of that country:
     <ol>
     <li>Input Image: Start by drag & drop or upload the image file.</li>
     
     <li>Choose Country: Select the desired country. Each country has its own set of specifications and requirements for passport photos.</li>
     <li>Apply High End Features: For faster processing you can uncheck the box / Check the box for applying the features.</li>

     
     <li>Preview and Download: Preview and download the generated passport photo.</li>
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
    <label style={{ color: 'white', textAlign: 'center' }}>Choose Country:</label>
       <Select style={{ width: 180, marginLeft:'5px'}} onChange={handleMenuClick}>
        {menuItems.map((item) => (
          <Option key={item.key} value={item.key}>{item.name}</Option>
        ))}      
    </Select>    
    <label className="labelStyle" style={{fontSize:'12px'}}>
      <input style={{color:'white'}}
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        /> Apply high end features.
        </label>   
  </Sider>
  <Layout className="site-layout">
        <ContentSection>
          { !imageUrl ? 
            <div className="passport-photo-container" style={{display:'block'}}>
            <Fade>
               {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
               Please select the format and upload the image in box below. */}
               <div style={{position:'relative', left:'100px',top:'5rem'}}>
     <b>Passport Photo Creation</b> involves creating a passport photo that meets the specific requirements of that country:
     <ol>
     <li>Input Image: Start by drag & drop or upload the image file.</li>
     
     <li>Choose Country: Select the desired country. Each country has its own set of specifications and requirements for passport photos.</li>
     <li>Apply High End Features: For faster processing you can uncheck the box / Check the box for applying the features.</li>

     
     <li>Preview and Download: Preview and download the generated passport photo.</li>
     </ol>
     </div>  </Fade>
                 <div className="center-card-container" style={{position:'relative', top:'50px', left:'180px'}}>
             <div style={{ flexGrow: '1' }}>
               <Card className="passport-photo-card"
                 title="Passport Photo"
                 cover=
                   {
                     <div style={{ display: 'flex' }}>
                       {imageUrl && (
                       <Cropper
                         key={cropperKey} 
                         ref={cropperRef}
                         src={imageUrl}
                         aspectRatio={aspectRatio}
                         style={{ textAlign:'center',height: 400 ,width:'50%', margin:'10px'}}
                         background={false}
                       />
                     )}
                       {displayUrl && <img className='uploaded-image' style={{ height: 400 ,width:'40%', marginLeft:'30px'}} src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                     </div>  
                   }
                   extra={
                    <Tooltip title="More Info">
                      <InfoCircleOutlined onClick={info} />
                    </Tooltip>
                  }
                   >
                 <Upload {...props} className="my-upload" 
                 onDrop={(e)=>handleDrop(e)}
                 >
                   <p>
                     <UploadOutlined /> 
                     Click or drag photo to this area to upload.
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
              <div style={{ flexGrow: '1' }}>
                <Card className="passport-photo-card"
                  title="Passport Photo"
                  cover=
                    {
                      <div style={{ display: 'flex' }}>
                        {imageUrl && (
                        <Cropper
                          key={cropperKey} 
                          ref={cropperRef}
                          src={imageUrl}
                          aspectRatio={aspectRatio}
                          style={{ textAlign:'center',height: 400 ,width:'50%', margin:'10px'}}
                          background={false}
                        />
                      )}
                        {displayUrl && <img className='uploaded-image' style={{ height: 400 ,width:'40%', marginLeft:'30px'}} src={displayUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                      </div>  
                    }
                    extra={
                      <Tooltip title="More Info">
                        <InfoCircleOutlined onClick={info} />
                      </Tooltip>
                    }>
                  <Upload {...props} className="my-upload" 
                  onDrop={(e)=>handleDrop(e)}
                  >
                    <p>
                      <UploadOutlined /> 
                      Click or drag photo to this area to upload.
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

export default PassportPhoto;