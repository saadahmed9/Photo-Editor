import React, { useState, createRef, useRef, useEffect } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Collage.css";
import { Card, Upload, Button, Layout, Menu, Tooltip } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import Template from './Template';
import TemplateCol from "./TemplateCol";
import STemplate from "./STemplate";
import { Fade } from 'react-reveal'

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
    const [imageUrl, setImageUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setCropperKey(cropperKey + 1); // reset the Cropper component with a new key
        };
        reader.readAsDataURL(file);
    };

    const handleClearone = () => {
        setIsLoading(false);
        setImageUrl(null);
    };

    function ConfirmDelete() {
        /* eslint-disable no-restricted-globals */
        var result = confirm("Are you sure you want to delete?");
        if (result) {
            setImageCollection([]);
        }
    }

    const handleRemoveImage = (index) => {
        const newImageCollection = [...imageCollection];
        newImageCollection.splice(index, 1);
        setImageCollection(newImageCollection);
    };

    const handleClear = () => {
        setImageCollection([]);
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
            key: 'layout13',
            name: 'Layout 13',
            imageUrl: '/Layouts/5-4.png'
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
    }, []); const props = {
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
            <Sider style={{ backgroundColor: '#000524', height: '100vh' }} collapsible collapsed={collapsed} onCollapse={onCollapse}>
                {!collapsed && (
                    <label style={{ color: 'white', textAlign: 'center', padding: '16px' }}>Choose Template:</label>
                )}
                {!collapsed ? (
                    <Menu theme="dark" mode="inline" style={{ backgroundColor: '#000524' }} className="sider-menu"
                        onClick={(e) => handleMenuClick(e)}>
                        {collageLayouts.map((item) => (
                            <Menu.Item key={item.key} style={{ marginBottom: '10px', objectPosition: 'center center' }}>
                                <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', height: 'auto' }} />
                            </Menu.Item>
                        ))}
                    </Menu>
                ) : (
                    <div className="collapsed-visual-cue" style={{ textAlign: 'center', marginTop: '20px' }}>
                        {/* Tooltip wrapper */}
                        <Tooltip title="Choose a template">
                            <PictureOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        </Tooltip>
                    </div>
                )}
            </Sider>


            <Layout className="site-layout" style={{ width: '80%', height: '90%', overflow: 'hidden' }}>
                <ContentSection>
                    {!selectedLayout && <Fade>
                        {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
          Please select the format and upload the image in box below. */}
                        <div style={{ position: 'relative', left: '10px', marginTop: '10rem',textAlign:"justify" }}>
                            <b>Collage Maker</b> involves creating photo collages by combining multiple images into a single composition using our intuitive collage maker.
                            <ol style={{textAlign:'justify' }}>
                                <li>Take control of your composition by choosing from a variety of templates, then dive into customization with the power of splitting and merging rows.</li>
                                <li>Add or delete columns with a simple click, giving you the flexibility to design a collage that perfectly fits your vision.</li>
                                <li>Upload your images seamlessly, arranging them with precision on the layout.</li>
                                <li>When your collage reaches perfection, save it with the download photo option. It's not just about combining images; it's about curating your moments in a way that's uniquely yours.</li>
                                
                            </ol>
                        </div>  </Fade>}
                    {selectedLayout === 'layout1' &&
                        <Template rows={1} initialColumnsPerRow={[2]} />
                    }

                    {selectedLayout === 'layout2' &&
                        <Template rows={2} initialColumnsPerRow={[1, 1]} />}
                    {selectedLayout === 'layout3' &&
                        <Template rows={1} initialColumnsPerRow={[3]} />
                    }
                    
                    {selectedLayout === 'layout5' &&
                        <Template rows={2} initialColumnsPerRow={[1, 2]} />
                    }
                    {selectedLayout === 'layout6' &&
                        <Template rows={1} initialColumnsPerRow={[4]} />
                    }
                    {selectedLayout === 'layout7' &&
                        <Template rows={4} initialColumnsPerRow={[1, 1, 1, 1]} />
                    }
                    {selectedLayout === 'layout8' &&
                        <Template rows={2} initialColumnsPerRow={[2, 2]} />
                    }
                    
                    {selectedLayout === 'layout10' &&
                        <Template rows={3} initialColumnsPerRow={[1, 2, 2]} />
                    }
                    {selectedLayout === 'layout11' &&
                        <Template rows={2} initialColumnsPerRow={[2, 3]} />
                    }
                    
                    {selectedLayout === 'layout13' &&
                        <Template rows={3} initialColumnsPerRow={[2, 1, 2]} />
                    }
                    
                </ContentSection>
            </Layout>

            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{ height: '100vh', overflowY: 'scroll' }}>
                {collapsed ? (
                    <div className="collapsed-visual-cue" onClick={() => onCollapse(false)}>
                        <Tooltip title="Upload images">
                            <UploadOutlined style={{ fontSize: '24px', color: '#fff', cursor: 'pointer' }} />
                        </Tooltip>
                    </div>
                ) : (
                    <>
                        
                        <div className="images-grid">
                        <ol style={{ color: 'gray',textAlign:"justify",marginLeft:"8px",marginRight:"5px"}}>
                        <h5 style={{ color: 'white', fontWeight: 'bold' }}>Steps:</h5>

                                <li>Choose the Template : Select any template from the left panel to create the collage.</li>
                                <li>Use the +/- at the top left corner of first cell to add/delete columns.</li>
                                <li>Use the split button to split current cell.</li>
                                <li>Input Image: Start by drag & drop or upload the image file into the layout.</li>
                                <li>To remove the image from the cell, click Remove at the bottom left corner of the uploaded image.</li>
                                <li>Click Download button below for downloading the collage.</li>
                            </ol>
                        </div>
                    </>
                )}
            </Sider>

        </Layout>
    );
};

export default Collage;
