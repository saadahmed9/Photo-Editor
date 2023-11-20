// Importing required libraries and components
import React, { useState, useRef, useEffect } from "react";
import { Card, Upload, Button, Layout, Spin, Modal, Tooltip } from 'antd';
import { UploadOutlined, LoadingOutlined, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './passportPhoto.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cropper from "react-cropper";
import { Select } from 'antd';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from 'antd';
import countriesData from './countriesData.jsx';


// Constants and initial configurations
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

// Content section component
const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};



// Main PassportPhoto component
const PassportPhoto = (props1) => {  

  // States and Refs initialization
  const { uuid } = props1;
  const [imageUrl, setImageUrl] = useState();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9)
  const [cropperKey, setCropperKey] = useState(0);
  const cropperRef = useRef(null);
  const [fileType, setFileType] =useState(null);
  const [displayUrl, setDisplayUrl] = useState();
  const [isLoading,setIsLoading]= useState(false);
  const [fileName, setfileName] = useState(null);

  // Function to handle sidebar collapse
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
    };

    const countryUrlMap = {
      Brazil: 'https://www.gov.br/mre/pt-br/consulado-montreal/brazilian-passport',
      Canada: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
      France: 'https://www.service-public.fr/particuliers/vosdroits/F10619?lang=en',// ... add URLs for other countries
      China: 'https://www.ivisa.com/photo/blog/china-passport-visa-photo-requirements-and-size',
      France: 'https://www.service-public.fr/particuliers/vosdroits/F10619?lang=en',
      Germany: 'https://www.germany.info/blob/906790/6e3eee9fd4d86e16aaefe0e92d809332/dd-sample-photos-data.pdf',
      India: 'https://visa.vfsglobal.com/one-pager/india/united-states-of-america/passport-services/pdf/photo-specifiation.pdf',
      Italy: 'https://www.italiandualcitizenship.net/italian-passport-requirements/#:~:text=For%20passport%20renewal%2C%20you%20must,it%20has%20been%20properly%20submitted.',
      Japan:'https://www.sf.us.emb-japan.go.jp/itpr_en/e_m03_01_02.html#:~:text=Size%3A%2035mm%20x%2045mm%20(width,more%20than%2036%20mm%20high.',
      Korea: 'https://overseas.mofa.go.kr/us-losangeles-en/brd/m_4394/view.do?seq=725383&srchFr=&srchTo=&srchWord=photo&srchTp=0&multi_itm_seq=0&itm_seq_1=0&itm_seq_2=0&company_cd=&company_nm=&page=1',
      Mexico: 'https://www.ivisa.com/photo/blog/mexican-passport-visa-photo-requirements-and-size#:~:text=So%20what%20are%20the%20Mexican,be%20older%20than%206%20months.',
      Netherlands:'https://www.netherlandsworldwide.nl/passport-id-card/photo-requirements',
      Russia: 'https://russianagency.com/en/photo-requirements/',
      Singapore: 'https://www.mfa.gov.sg/Overseas-Mission/Phnompenh/Consular-Services/Application-for-Singapore-Passport',
      Spain:'https://es.usembassy.gov/passports/#guidelines',
      Turkey: 'https://www.timpson.co.uk/services/passport-photos/international-passport-photo-sizes/turkey',
      UK: 'https://www.gov.uk/photos-for-passports/photo-requirements#:~:text=You%20need%20to%20provide%202,version%20of%20a%20larger%20picture',
      USA: 'https://travel.state.gov/content/travel/en/passports/how-apply/photos.html',
      Saudi_Arabia: 'https://www.saudiembassy.net/guideline-accepted-photographs-saudi-visas',
      UAE:'https://www.ivisa.com/photo/blog/the-united-arab-emirates-passportvisa-photo-requirements-and-size',
      New_Zealand:'https://www.passports.govt.nz/passport-photos/check-your-photo-meets-the-technical-requirements/',
      Malaysia:'https://www.imi.gov.my/index.php/en/main-services/passport/malaysian-international-passport/',
      Argentina: 'https://photogov.com/documents-requirements/ar-passport-15x15-inch-photo/',
      South_Africa:'https://www.southafrica-usa.net/homeaffairs/pp_tourist.htm',
      Thailand:'https://thaiconsulatela.thaiembassy.org/en/publicservice/documents-required-for-renew-thai-passport-2?page=61b1064202fd6d10a962f3a4',
      Indonesia:'https://www.ivisa.com/photo/blog/indonesian-passport-visa-photo-requirements-and-size-2',
      Vietnam:'https://vietnamconsulate-sf.org/en/2017/05/11/thu-tuc-cap-ho-chieu-lan-dau-cho-cong-dan-viet-nam-dinh-cu-tai-hoa-ky/',
      Chile:'https://chile-evisa.com/chile-visa-photo-requirements-and-size/'
    }
    
    // Component for displaying hint when sidebar is collapsed
    const CollapsedHint = () => (
        <div className="collapsed-hint">
            <ArrowRightOutlined className="hint-icon" />
            <p>Choose Country</p>
        </div>
    );

    
    



  const menuItems = [
    { key: '1', name: 'USA', size: '51x51 (mm)' },
{ key: '2', name: 'Canada',size: '50x70 (mm)' },
{ key: '3', name: 'China',size: '33x48 (mm)' },
{ key: '4', name: 'France',size: '35x45 (mm)' },
{ key: '5', name: 'Germany',size: '35x45 (mm)' },
{ key: '6', name: 'India',size: '51x51 (mm)' },
{ key: '7', name: 'Italy' ,size: '51x51 (mm)' },
{ key: '8', name: 'Japan',size: '35x45 (mm)' },
{ key: '9', name: 'Korea',size: '35x45 (mm)' },
{ key: '10', name: 'Mexico',size: '35x45 (mm)' },
{ key: '11', name: 'Netherlands',size: '35x45 (mm)' },
{ key: '12', name: 'Russia',size: '35x45 (mm)' },
{ key: '13', name: 'Singapore',size: '35x45 (mm)' },
{ key: '15', name: 'Turkey',size: '50x60 (mm)' },
{ key: '16', name: 'UK',size: '35x45 (mm)' },
{ key: '17', name: 'Brazil',size: '50x70 (mm)' },
{ key: '18', name: 'Saudi_Arabia',size: '51x51 (mm)' },
{ key: '19', name: 'UAE',size: '35x45 (mm)' },
{ key: '20', name: 'New_Zealand',size: '35x45 (mm)' },
{ key: '21', name: 'Malaysia',size: '35x50 (mm)' },
{ key: '22', name: 'Argentina',size: '38x38 (mm)' },
{ key: '23', name: 'South_Africa',size: '51x51 (mm)' },
{ key: '25', name: 'Indonesia',size: '51x51 (mm)' },
{ key: '26', name: 'Vietnam',size: '51x51 (mm)' },
{ key: '27', name: 'Chile',size: '35x45 (mm)' },
{ key: '28', name: 'Spain',size: '30x40 (mm)' },

  ];
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const handleMenuClick = (value) => {
    const selectedCountry = menuItems.find((item) => item.key === value)?.name;
    setSelectedCountry(selectedCountry);
    let countryAspectRatio = getAspectRatioByCountry(selectedCountry);
    setAspectRatio(countryAspectRatio);  
    setCropperKey(cropperKey + 1);
  }; 

  const handleVisitWebsite = () => {
    if (selectedCountry && countryUrlMap[selectedCountry]) {
      window.open(countryUrlMap[selectedCountry], '_blank');
    }
  };

  const getAspectRatioByCountry = (selectedCountry) => {
    let countryInfo = countriesData.find((country) => country[selectedCountry]);
    console.log(selectedCountry);
    console.log("in getaspectratio");
    console.log(countryInfo[selectedCountry]);
    if (countryInfo) {
      let [width_frame, height_frame] = countryInfo[selectedCountry].split(',').map(Number);
      return (parseFloat(width_frame) / parseFloat(height_frame));
    }
    return 1; // Default aspect ratio if country info is not found
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
      setCropperKey(cropperKey + 1); 
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
          <Sider style={{ backgroundColor: '#000524' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
              {collapsed ? (
                  <CollapsedHint />
              ) : (
                  <>
                      <label style={{ color: 'white', textAlign: 'center' }}>Choose Country:</label>
                      <Select style={{ width: 180, marginLeft: '5px' }} onChange={handleMenuClick}>
                          {menuItems.map((item) => (
                              <Option key={item.key} value={item.key}>
                                {`${item.name.replace('_', ' ')} - ${item.size}`}
                              </Option>
                          ))}
                      </Select>

                          {/* Display text and a button to visit the website under the "Choose Country" dropdown */}
                          {selectedCountry && countryUrlMap[selectedCountry] && (
                            <div style={{ marginTop: '4px',marginLeft: '8px' }}>
                              <p style={{ color: 'white', marginBottom: '2px' }}>
                                Check requirements here:
                              </p>
                              <Button type="primary" onClick={handleVisitWebsite}>
                                Visit Website
                              </Button>
                            </div>
                          )}
                          
                          <label className="labelStyle">
                              <Checkbox
                                  checked={isChecked}
                                  onChange={(e) => handleCheckboxChange(e)}
                                  className="modern-checkbox"
                              />
                              &nbsp; Apply high end features.
                          </label>
                  </>
              )}
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
                         cropBoxResizable={false}
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
                          cropBoxResizable={false}
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