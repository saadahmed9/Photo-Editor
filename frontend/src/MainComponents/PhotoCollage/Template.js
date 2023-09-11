import React, { useState } from 'react';
import { Upload, Row, Col, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './Collage.css'; // Import the CSS file
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import axios from 'axios';

const Template = ({ rows, columnsPerRow }) => {
  const totalCells = columnsPerRow.reduce((sum, columns) => sum + columns, 0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageScales, setImageScales] = useState(Array(totalCells).fill(1));
  const [images, setImages] = useState(Array(totalCells).fill(null));
  

  const handleWheel = (index) => (e) => {
    e.preventDefault();
    const updatedScales = [...imageScales];
    const scaleFactor = 0.1;
    updatedScales[index] += e.deltaY < 0 ? scaleFactor : -scaleFactor;
    setImageScales(updatedScales);
  };
  const zoomIn = (index) => () => {
    const updatedScales = [...imageScales];
    const scaleFactor = 0.1;
    updatedScales[index] += scaleFactor;
    setImageScales(updatedScales);
  };
  
  const zoomOut = (index) => () => {
    const updatedScales = [...imageScales];
    const scaleFactor = 0.1;
    updatedScales[index] -= scaleFactor;
    setImageScales(updatedScales);
  };
  
  const createHandleFileInput = (index) => (info) => {
    const { file } = info;

    if (file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedImages = [...images];
        updatedImages[index] = e.target.result;
        setImages(updatedImages);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };
  const createOnDropHandler = (index) => (info) => {
    const item = info.dataTransfer.items[0];
    if (item.kind === 'string') {
      item.getAsString((data) => {  
        const updatedImages = [...images];
        updatedImages[index] = data;
        setImages(updatedImages);
        // handle the dropped string data
      })
    }
  };

  const removeImage = (index) => (e) => {
    e.stopPropagation();
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
  };

  let cellIndex = 0;

  const gridRows = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const gridItems = [];
    for (let colIndex = 0; colIndex < columnsPerRow[rowIndex]; colIndex++) {
      gridItems.push(
        <Col key={cellIndex} span={24 / columnsPerRow[rowIndex]} style={{ padding: 0 ,overflow: 'scroll',overflowX:'auto',overflowY:'auto'}}>
         <div>
            <Upload.Dragger
              type='file'
              accept="image/*"
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess('ok');
                }, 0);
              }}

              onChange={createHandleFileInput(cellIndex)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                display: images[cellIndex] ? 'none' : 'flex',
              }}
              multiple={false}
              onDrop={createOnDropHandler(cellIndex)}
            >
              <InboxOutlined />
            </Upload.Dragger>
            {images[cellIndex] && (
             <div
             className="image-container"
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '1000px',
               //height: '500px',
             }}
           >
             <img
               src={images[cellIndex]}
               alt=""
               style={{
                 width: '100%',
                 //height: '100%',
                 transform: `scale(${imageScales[cellIndex]})`,
                 transformOrigin: 'center',
               }}
             />
            
             <button
  className="zoom-in-button"
  onClick={zoomIn(cellIndex)}
  style={{ display: isDownloading ? 'none' : 'block' }}
>
  <PlusOutlined />


</button>
<button
  className="zoom-out-button"
  onClick={zoomOut(cellIndex)}
  style={{ display: isDownloading ? 'none' : 'block' }}
>
  <MinusOutlined />
</button>
             <button
               className="remove-button"
               onClick={removeImage(cellIndex)}
             >
               Remove
             </button>
             
           </div>
           
           
      //    <div
      //    className="image-container"
      //    style={{
      //      position: 'absolute',
      //      top: 0,
      //      left: 0,
      //      width: '100%',
      //      height: '500px',
      //    }}
      //    onWheel={handleWheel(cellIndex)}
      //  >
      //    <img
      //      src={images[cellIndex]}
      //      alt=""
      //      style={{
      //        maxWidth: '100%',
      //        maxHeight: '100%',
      //        transform: `scale(${imageScales[cellIndex]})`,
      //        transformOrigin: 'center',
      //      }}
      //    />
      //    <button
      //      className="remove-button"
      //      onClick={
      //        removeImage(cellIndex)
      //      }
      //    >
      //      Remove
      //    </button>
      //  </div>
       
          
          
            )}
          </div>
        </Col>
      );
      cellIndex++;
    }
    gridRows.push(
      <Row key={rowIndex} style={{height:'500px',width:'100%'}}>
        {gridItems}
      </Row>
    );
  }
  const downloadCollage = async () => {
    setIsDownloading(true);
    const formData = new FormData();
    formData.append('function', 'photo_collage');
      axios.post(process.env.REACT_APP_API_URL+'/photo_collage/', formData)
      .then(response => {
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered.");}); 

  const zoomInButtons = document.querySelectorAll(".zoom-in-button");
  const zoomOutButtons = document.querySelectorAll(".zoom-out-button");
  const removeButtons = document.querySelectorAll(".remove-button");

  // Hide buttons
  zoomInButtons.forEach((button) => (button.style.display = "none"));
  zoomOutButtons.forEach((button) => (button.style.display = "none"));
  removeButtons.forEach((button) => (button.style.display = "none"));
    try {
      const collage = document.getElementById('collage');
      const canvas = await html2canvas(collage, {
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        width: collage.offsetWidth,
        height: collage.offsetHeight,
      });
      canvas.toBlob((blob) => {
        saveAs(blob, 'collage.png');
      });
    } catch (err) {
      console.error('Failed to download collage:', err);
    }
    zoomInButtons.forEach((button) => (button.style.display = "block"));
  zoomOutButtons.forEach((button) => (button.style.display = "block"));
  removeButtons.forEach((button) => (button.style.display = "block"));
    setIsDownloading(false);
  };
  
  
  

  return (
    <div>
      <div className="layout" id="collage">
        {gridRows}
      </div>
      <div className='containerButton'>
        <Button onClick={downloadCollage} className='downloadButton'>Download Collage</Button>
      </div>
    </div>);
};


export default Template;