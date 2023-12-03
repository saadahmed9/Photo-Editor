import React, { useState, useEffect } from "react";
import "cropperjs/dist/cropper.css";
import "./PdfCreator.css";
import { Button, Layout, Menu, Spin } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Fade } from 'react-reveal';
import { v4 as uuidv4 } from 'uuid';

// Spinner icon configuration
const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 48,
            color: 'black'
        }}
        spin
    />
);
const { Sider, Content } = Layout;

// This component acts as the content section, wrapping children within the needed styling
const ContentSection = ({ children }) => {
    return (
        <Content style={{ padding: "0 50px" }}>
            <div className="site-layout-content">{children}</div>
        </Content>
    );
};

export const PdfCreator = () => {
    // State declarations
    const [imageSrc, setImageSrc] = useState('');
    const [cropperKey, setCropperKey] = useState(0);
    const [imageCollection, setImageCollection] = useState([]);
    const [pdfUrl, setpdfUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setfileName] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    // Handle sidebar collapse and expansion
    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    // Image removal handlers
    const handleImageRemove = (indexToRemove) => {
        const newImageCollection = imageCollection.filter((_, index) => index !== indexToRemove);
        setImageCollection(newImageCollection);
    };

    const handleRemoveImage = (index) => {
        const newImageCollection = [...imageCollection];
        newImageCollection.splice(index, 1);
        setImageCollection(newImageCollection);
    };

    function ConfirmDelete() {
        /* eslint-disable no-restricted-globals */
        var result = confirm("Are you sure you want to delete?");
        if (result) {
            setImageCollection([]);
        }
    }

    // Image uploading handlers
    const handleUpload = (file) => {
        // Generate a unique ID for the file name
        let uniqueId = uuidv4();
        setfileName(file.name.split('.').slice(0, -1).join('.') + '_' + uniqueId);
        // Validate blob
        if (!(file instanceof Blob)) {
            console.log(file);
            console.error('Error: parameter is not a Blob object');
            //return;
        }

        // Read image data
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

    // Handle image drop into the component
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

    // Prevent default dragover behavior
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    // Add drag-drop event listener
    useEffect(() => {
        document.addEventListener('drop', handleDrop);

        // Remove event listener when component is unmounted
        return () => {
            document.removeEventListener("drop", handleDrop);
        };
    }, []);

    // Image upload configurations
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

    // Clear all images
    const handleClear = () => {
        setImageCollection([]);
    };


    // Handle the addition of images from the sidebar
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

    // Utility function to convert data URI to a File
    function dataURItoFile(dataURI, filename) {
        let byteString = atob(dataURI.split(',')[1]);
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ab], { type: mimeString });
        return new File([blob], filename, { type: mimeString });
    }

    // Fetch data on upload and create PDF
    function getDataOnUpload() {
        setIsLoading(true);
        const formData = new FormData();
        if (!(imageCollection.length > 0)) {
            toast.error("Upload images.")
        }
        for (let i = 0; i < imageCollection.length; i++) {
            let file = dataURItoFile(imageCollection[i], 'example' + i + '.jpg');
            formData.append('myfile', file);
        }
        formData.append('function', 'pdf_maker');
        // axios.post(process.env.REACT_APP_PDF_NOISE_BRIGHT_API_URL + '/pdf_maker/', formData)
        axios.post("http://xlabk8s3.cse.buffalo.edu:30013/pdf_maker/", formData)
            .then(response => {
                setIsLoading(false);
                setpdfUrl(response.data['imageUrl']);
            })
            .catch(error => { console.log(error); toast.error("Error encountered."); setIsLoading(false) });
    }


    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                className={collapsed ? "pdf-creator-collapsed-sidebar" : "pdf-creator-expanded-sidebar"}
            >
                {collapsed ?
                    (
                        <div className="pdf-creator-collapsed-icon-container">
                            <i className="fa fa-camera pdf-creator-collapsed-icon" aria-hidden="true" title="Add images to create a PDF"></i>
                        </div>
                    ) :
                    (
                        <>

                            <label style={{ color: 'white', textAlign: 'center' }}>Images:</label>

                            <div style={{ position: "relative", width: "200px", height: '50px' }}>
                                <button style={{ width: "100%", height: "100%", }}>
                                    <i class="fa fa-plus-circle" aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}></i>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => SiderImageUpload(e)}
                                        //onClick={(e) => e.target.value = null} 
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


                            <button style={{ width: "100%" }} onClick={ConfirmDelete} margin-top="10px">Clear</button>
                            <div className="images-grid">
                                {imageCollection.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img src={image} className="image" draggable="true"
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData("image/jpeg", image);
                                            }}
                                        />
                                        <button className="remove-image-btn" onClick={() => handleRemoveImage(index)}>Remove</button>
                                    </div>
                                ))}
                            </div>

                        </>
                    )
                }
            </Sider>


            <div style={{ marginLeft: '12%', marginTop: '10px', textAlign: 'center' }}>

                <Button
                    className="button-stylish"
                    onClick={getDataOnUpload}
                >
                    Create PDF
                </Button>


                {isLoading && <Spin indicator={antIcon} style={{
                    position: 'absolute',
                    height: '100%',
                    width: '16%',
                    top: '50%',
                    left: '50%',
                    margin: '-50px 0px 0px -50px'
                }} />}
                {!pdfUrl ?
                    <Fade>
                        <div style={{ position: 'relative' }}>
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