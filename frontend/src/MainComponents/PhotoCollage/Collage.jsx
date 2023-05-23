import React, { useState, createRef, useRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Collage.css";
import { Card, Upload, Button, Layout, Menu } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Template from './Template';
import TemplateCol from "./TemplateCol";
import STemplate from "./STemplate";
import {Fade } from 'react-reveal'

const { Sider, Content } = Layout;


const ContentSection = ({ children }) => {
  return (
    <Content style={{ padding: "0 50px" }}>
      <div className="site-layout-content">{children}</div>
    </Content>
  );
};

export const Collage = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [selectedLayout, setSelectedLayout] = useState();
  const [cropperKey, setCropperKey] = useState(0);
  const cropperRef = useRef(null);
  const [cropData, setCropData] = useState("#");
  const [imageCollection, setImageCollection] = useState([]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
    };
    reader.readAsDataURL(file);
  };


  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const collageLayouts = [

    {
      key: 'layout1',
      name: 'Layout 1',
      imageUrl: '/Layouts/2-1.png'
    },
    {
      key: 'layout2',
      name: 'Layout 2',
      imageUrl: '/Layouts/2-2.png'
    },
    {
      key: 'layout3',
      name: 'Layout 3',
      imageUrl: '/Layouts/3-1.png'
    },
    {
      key: 'layout4',
      name: 'Layout 4',
      imageUrl: '/Layouts/3-2.png'
    },
    {
      key: 'layout5',
      name: 'Layout 5',
      imageUrl: '/Layouts/3-3.png'
    },
    {
      key: 'layout6',
      name: 'Layout 6',
      imageUrl: '/Layouts/4-1.png'
    },
    {
      key: 'layout7',
      name: 'Layout 7',
      imageUrl: '/Layouts/4-2.png'
    },
    {
      key: 'layout8',
      name: 'Layout 8',
      imageUrl: '/Layouts/4-3.png'
    },
    {
      key: 'layout9',
      name: 'Layout 9',
      imageUrl: '/Layouts/4-4.png'
    },
    {
      key: 'layout10',
      name: 'Layout 10',
      imageUrl: '/Layouts/5-1.png'
    },
    {
      key: 'layout11',
      name: 'Layout 11',
      imageUrl: '/Layouts/5-2.png'
    },
    {
      key: 'layout12',
      name: 'Layout 12',
      imageUrl: '/Layouts/5-3.png'
    },
    {
      key: 'layout13',
      name: 'Layout 13',
      imageUrl: '/Layouts/5-4.png'
    },
    {
      key: 'layout14',
      name: 'Layout 14',
      imageUrl: '/Layouts/static.png'
    },


    // Add more layout objects as needed
  ];

  const handleMenuClick = (event) => {
    const selectedLayout = collageLayouts.find((item) => item.key === event.key)?.key;
    setSelectedLayout(selectedLayout);
  };
  const handleUpload1 = (file) => {

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
  const handleDrop1 = (e) => {

    e.preventDefault();
    console.log(e);
    const check = e.dataTransfer.getData('image');
    const file = e.dataTransfer.items[3];
    console.log(file)
    if (file) {
      handleUpload1(file);

    }
  };

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  useEffect(() => {
    document.addEventListener('drop', handleDrop1);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("drop", handleDrop1);
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
        handleUpload1(info.file.originFileObj);
      }
    },
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: '#000524',height: '100vh', overflowY: 'scroll'  }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <label style={{ color: 'white', textAlign: 'center' }}>Choose Template:</label>
        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524' }}
          onClick={(e) => handleMenuClick(e)}>
          {collageLayouts.map((item) => (
            <Menu.Item key={item.key} style={{ marginBottom: '10px', objectPosition: 'center center' }}>
              <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', height: 'auto' }} />
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout className="site-layout" style={{ width: '80%', height: '90%',overflow:'hidden' }}>
        <ContentSection>
          {!selectedLayout && <Fade>
          {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
          <div style={{position:'relative', left:'70px',marginTop:'20rem'}}>
<b>Collage Maker</b> involves creating photo collages by combining multiple images into a single composition using our intuitive collage maker.
<ol>
  <li>Choose Template : Select any template from the left panel to create the collage.</li>
  <li>Images : Upload images using the right panel.</li>
<li>Input Image: Start by drag & drop or upload the image file from the images panel or directly from local into the layout.</li>

<li>Output Image: Save the image data into a file to the local using the download photo option.</li>
</ol>
</div>  </Fade>}
          {selectedLayout === 'layout1' &&
            <Template rows={1} columnsPerRow={[2]} />
          }

          {selectedLayout === 'layout2' &&
            <Template rows={2} columnsPerRow={[1, 1]} />}
          {selectedLayout === 'layout3' &&
            <Template rows={1} columnsPerRow={[3]} />
          }
          {selectedLayout === 'layout4' &&
            <TemplateCol columns={2} rowsPerColumn={[1, 2]} />
          }
          {selectedLayout === 'layout5' &&
            <Template rows={2} columnsPerRow={[1, 2]} />
          }
          {selectedLayout === 'layout6' &&
            <Template rows={1} columnsPerRow={[4]} />
          }
          {selectedLayout === 'layout7' &&
            <Template rows={4} columnsPerRow={[1, 1, 1, 1]} />
          }
          {selectedLayout === 'layout8' &&
            <Template rows={2} columnsPerRow={[2, 2]} />
          }
          {selectedLayout === 'layout9' &&
            <TemplateCol columns={2} rowsPerColumn={[1, 3]} />
          }
          {selectedLayout === 'layout10' &&
            <Template rows={3} columnsPerRow={[1, 2, 2]} />
          }
          {selectedLayout === 'layout11' &&
            <Template rows={2} columnsPerRow={[2, 3]} />
          }
          {selectedLayout === 'layout12' &&
            <TemplateCol columns={3} rowsPerColumn={[1, 2, 2]} />
          }
          {selectedLayout === 'layout13' &&
            <Template rows={3} columnsPerRow={[2, 1, 2]} />
          }
          {selectedLayout === 'layout14' &&
            <STemplate columns={2} rowsPerColumn={[1, 3]} />
          }
        </ContentSection>
      </Layout>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ height: '100vh', overflowY: 'scroll' }}>
        <label style={{ color: 'white', textAlign: 'center' }}>Images:</label>
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


      </Sider>
    </Layout>
  );
};

export default Collage;
