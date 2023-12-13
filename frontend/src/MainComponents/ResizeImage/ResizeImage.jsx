// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Layout, Spin, Modal, Tooltip } from 'antd';
import { UploadOutlined, LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './ResizeImage.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';


// Loading spinner icon configuration
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 48,
            color: 'black'
        }}
        spin
    />
);


// Destructure Content from Layout
const { Content } = Layout;


// A functional component for the content section
const ContentSection = ({ children }) => (
    <Content style={{ padding: "0 50px" }}>
        <div className="site-layout-content">{children}</div>
    </Content>
);

function ResizeImage({ uuid }) {
    // Declare state variables
    const [imageUrl, setImageUrl] = useState();
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [fileType, setFileType] = useState(null);
    const [displayUrl, setDisplayUrl] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    // Handlers for input changes and sidebar collapse
    const handleInputChange1 = (event) => setInput1(event.target.value);
    const handleInputChange2 = (event) => setInput2(event.target.value);
    const onCollapse = (collapsed) => setCollapsed(collapsed);

    // Reset some states
    const handleClear = () => {
        setIsLoading(false);
        setImageUrl(null);
        setDisplayUrl(null);
    };

    // Extract image type from data URL
    function getImageTypeFromMime(dataUrl) {
        return dataUrl.split(',')[0].split(':')[1].split(';')[0].split('/')[1];
    }

    // Handle file uploads and generate preview
    const handleUpload = (file) => {
        const reader = new FileReader();
        const uniqueId = uuidv4();
        setFileName(file.name.split('.').slice(0, -1).join('.') + '_' + uniqueId);

        reader.onload = () => {
            setFileType(getImageTypeFromMime(reader.result));
            setImageUrl(reader.result);
        };

        reader.onerror = (error) => console.error('Error:', error);

        reader.readAsDataURL(file);
        
    };

    // Handle file drop
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleUpload(file);
       
    };

    // Document event listeners
    document.addEventListener('dragover', (e) => e.preventDefault());

    // Upload configurations
    const uploadProps = {
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
        }
    };


    // Convert data URL to File object
    function dataURLtoFile(dataURL, fileName) {
        const mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
        const data = atob(dataURL.split(',')[1]);
        const array = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            array[i] = data.charCodeAt(i);
        }
        return new File([new Blob([array], { type: mime })], fileName, { type: mime });
    }

    // Download the processed image
    function downloadImage(url1) {
        fetch(url1)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    setIsLoading(false);
                    setDisplayUrl(reader.result);
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                console.log(error);
                toast.error("Error encountered.");
                setIsLoading(false);
            });
    }


    // Handle image download
    function handleDownload() {
        const link = document.createElement('a');
        link.href = displayUrl;
        link.setAttribute('download', fileName + '.' + fileType);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Image Resize Successfully Completed");
    };

    let defaultWidth;

// Function to set the default width
    
    // Preview the processed image
    async function handlePreview() {
        if (!input1) {
            toast.error("Please enter width");
            return;
        }
    
        if (!input2) {
            toast.error("Please enter height");
            return;
        }
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('myfile', dataURLtoFile(imageUrl, fileName + "." + fileType));
        formData.append('resize', `${input1},${input2}`);
        formData.append('function', 'resize');

        //axios.post(`${process.env.REACT_APP_API_URL}/resize/`, formData)
        axios.post("http://xlabk8s3.cse.buffalo.edu:30011/resize/", formData)
      
        .then(response => {
            downloadImage(response.data.imageUrl);
            //adjustContainerWidth();
            const previewImage = new Image();
            previewImage.src = response.data.imageUrl;
            previewImage.onload = () => {
                setIsLoading(false);
            }; // Call the function to adjust width
        })
            .catch(error => {
                console.log(error);
                toast.error("Error encountered.");
                setIsLoading(false);
            });
    }

    // Handle drop event
    useEffect(() => {
        document.addEventListener('drop', handleDrop);
        // Cleanup the event listener
        return () => document.removeEventListener("drop", handleDrop);
    }, []);


    // Display information model
    const info = () => {
        Modal.info({
            title: 'Resize Your Image',
            content: (
                <div>
                    <p>Easily adjust its dimensions following these steps:</p>
                    <ol>
                        <li>Drag & Drop: Or just upload your image.</li>
                        <li>Set Width: Use the textbox on the left.</li>
                        <li>Set Height: Adjust with the textbox on the left.</li>
                        <li>Preview: Once satisfied, go ahead and download.</li>
                    </ol>
                </div>
            ),
            
            onOk() { },
            width: 600
        });
    };


    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar content */}
            <Layout.Sider className="sidebar" collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="input-container">
                    <label className="labelx">Width (in pixels):</label>
                    <input type="text" value={input1} onChange={handleInputChange1} placeholder="e.g. 1080" />
                </div>
                <div className="input-container">
                    <label className="labely">Height (in pixels):</label>
                    <input type="text" value={input2} onChange={handleInputChange2} placeholder="e.g. 720" />
                </div>
            </Layout.Sider>

            {/* Main content */}
            <Layout className="site-layout">

                <ContentSection>
                    {!imageUrl ?
                        <div className="passport-photo-container" style={{ display: 'block' }}>
                            <Fade>
                                {/* Users can convert their images into the desired format, such as JPEG, PNG, and more.
           Please select the format and upload the image in box below. */}
                                <div style={{ position: 'relative', left: '230px', top: '5rem' }}>
                                    <b>Resize Your Image</b> Easily adjust its dimensions in a few steps:
                                    <ol>
                                        <li>Drag & Drop: Or simply upload your image.</li>
                                        <li>Set Width: Input desired width on the left.</li>
                                        <li>Set Height: Input desired height on the left.</li>


                                        <li>Preview: Check the final look & download.</li>
                                    </ol>
                                </div>  </Fade>
                            <div className="center-card-container" style={{ position: 'relative', top: '50px', left: '180px'}}>
                                <div style={{ flexGrow: '1' }}>
                                    <Card className="passport-photo-card"
                                        title={
                                            displayUrl ? "Image Preview" : "Upload Your Image"
                                        }
                                        cover=
                                        {
                                            <div>
                                                {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                                                {displayUrl && <img className='uploaded-image' src={displayUrl}  onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                                            </div>
                                        }
                                        extra={
                                            <Tooltip title="More Info">
                                                <InfoCircleOutlined onClick={info} />
                                            </Tooltip>
                                        }
                                    >
                                        <Upload {...uploadProps} className="my-upload">

                                            <p>
                                                <UploadOutlined /> Drag & drop or click to upload
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
                            <div className="center-card-container" style={{maxWidth:"600px"}}>
                                <div style={{ flexGrow: '1' }}>
                                    <Card className="passport-photo-card"
                                        title={
                                            displayUrl ? "Uploaded Image and Result" : "Drag and Drop Photo"
                                        }
                                        cover=
                                        {
                                            <div style={{ display: 'flex', justifyContent: displayUrl ? 'space-between' : 'center'}}>
                                                {imageUrl && <img className='uploaded-image' id="image" src={imageUrl} style={{marginRight: displayUrl ? '25px' : 'auto', marginLeft: displayUrl ? '15px' : 'auto',marginTop: '65px',maxWidth: displayUrl ? '250px' : '400px', maxHeight: displayUrl ? '190px' : '100%'}} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e)} />}
                                                
                                                {displayUrl && (
                                                <div className="scrollable-container">
             <div className="image-item">
            <img src={displayUrl} className="image1" draggable="true" />
            </div>
            </div>
        )}
                                                
                                                
                                            ;</div>
                                        }
                                        extra={
                                            <Tooltip title="More Info">
                                                <InfoCircleOutlined onClick={info} />
                                            </Tooltip>
                                        }
                                    >
                                        <Upload {...uploadProps} className="my-upload">

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