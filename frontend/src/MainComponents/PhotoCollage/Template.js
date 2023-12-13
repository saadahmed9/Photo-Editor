import React, { useState,Fragment  } from 'react';
import { Upload, Row, Col, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './Collage.css'; // Import the CSS file
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import ImageUploadRow from './ImageUploadRow';

const Template = ({ rows, initialColumnsPerRow }) => {
  const [columnsPerRow, setColumnsPerRow] = useState(initialColumnsPerRow);
  const totalCells = columnsPerRow.reduce((sum, columns) => sum + columns, 0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageScales, setImageScales] = useState(Array(totalCells).fill(1));
  const [imageScalesRow2, setImageScalesRow2] = useState(Array(totalCells).fill(1));
  const [imagesRow2, setImagesRow2] = useState(Array(totalCells).fill(null));
  const [images, setImages] = useState(Array(totalCells).fill(null));
  const [isMergeButtonVisible, setIsMergeButtonVisible] = useState(true);
  //const [showOtherDiv, setShowOtherDiv] = useState(false);
  const [showOtherDiv, setShowOtherDiv] = useState(Array(totalCells).fill(false));
  //const [cellIndexRow1, setCellIndexRow1] = useState(10);
  const splitColumn = (rowIndex, colIndex) => {
    const updatedColumnsPerRow = [...columnsPerRow];
    console.log(columnsPerRow)
    if( updatedColumnsPerRow[rowIndex]<4){
    updatedColumnsPerRow[rowIndex]++;
    }
    setColumnsPerRow(updatedColumnsPerRow);
  };
  const deleteColumn = (rowIndex, colIndex) => {
    const updatedColumnsPerRow = [...columnsPerRow];
    console.log(columnsPerRow)
    if( updatedColumnsPerRow[rowIndex]>1){
    updatedColumnsPerRow[rowIndex]--;
    }
    setColumnsPerRow(updatedColumnsPerRow);
  };

  const toggleDiv = (rowIndex, colIndex) => {
    setShowOtherDiv((prevState) => {
      const newState = [...prevState];
      const cellIndex = columnsPerRow
        .slice(0, rowIndex)
        .reduce((sum, columns) => sum + columns, 0) + colIndex;
      newState[cellIndex] = !newState[cellIndex];
      return newState;
    });
  };
  
  
  const zoomIn = (index) => () => {
    const updatedScales = [...imageScales];
    const scaleFactor = 0.1;
    updatedScales[index] += scaleFactor;
    setImageScales(updatedScales);
  };
  const zoomInRow2 = (index) => () => {
    const updatedScales = [...imageScalesRow2];
    const scaleFactor = 0.1;
    updatedScales[index] += scaleFactor;
    setImageScalesRow2(updatedScales);
  };

  
  const zoomOut = (index) => () => {
    const updatedScales = [...imageScales];
    const scaleFactor = 0.1;
    updatedScales[index] -= scaleFactor;
    setImageScales(updatedScales);
  };
  
  const zoomOutRow2 = (index) => () => {
    const updatedScales = [...imageScalesRow2];
    const scaleFactor = 0.1;
    updatedScales[index] -= scaleFactor;
    setImageScalesRow2(updatedScales);
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
    setIsMergeButtonVisible(false);
  };
  const createHandleFileInputRow2 = (index) => (info) => {
    const { file } = info;

    if (file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedImages = [...imagesRow2];
        updatedImages[index] = e.target.result;
        setImagesRow2(updatedImages);
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
    setIsMergeButtonVisible(false);
  };
  const createOnDropHandlerRow2 = (index) => (info) => {
    const item = info.dataTransfer.items[0];
    if (item.kind === 'string') {
      item.getAsString((data) => {  
        const updatedImages = [...imagesRow2];
        updatedImages[index] = data;
        setImagesRow2(updatedImages);
        // handle the dropped string data
      })
    }
  };

  const removeImage = (index) => (e) => {
    e.stopPropagation();
    const updatedImages = [...images];
    updatedImages[index] = null;
    setImages(updatedImages);
    setIsMergeButtonVisible(true);
  };
  const removeImageRow2 = (index) => (e) => {
    e.stopPropagation();
    const updatedImages = [...imagesRow2];
    updatedImages[index] = null;
    setImagesRow2(updatedImages);
  };

  let cellIndex = 0;
  let cellIndexRow1 = 0;
  
  
  const gridRows = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const gridItems = [];
    for (let colIndex = 0; colIndex < columnsPerRow[rowIndex]; colIndex++) {
      gridItems.push(
        <Col key={cellIndex} span={24 / columnsPerRow[rowIndex]} style={{ padding: 0,border:"0.5px solid gray" ,backgroundColor:"#e3dddd",overflow: 'scroll',overflowX:'auto',overflowY:'auto'}}>
         {showOtherDiv[cellIndex]  ? (
            // This is the other div that will be shown when the button is pressed
            <Fragment>
            <div style={{ height: '100%', position: 'relative' }}>
                      {isMergeButtonVisible && (
                  <Button
                    onClick={() => toggleDiv(rowIndex, colIndex)}
                    style={{
                      position: 'absolute',
                      top: '3px',
                      right: '5px',
                      zIndex: 1,
                      backgroundColor: 'black', 
                      borderColor:"black"
                    }}
                  >
                    Merge Rows
                  </Button>
                )}
                        <ImageUploadRow
                cellIndex={cellIndex}
                images={images}
                createHandleFileInput={createHandleFileInput}
                createOnDropHandler={createOnDropHandler}
                imageScales={imageScales}
                backgroundColor="#e3dddd"
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                isDownloading={isDownloading}
                removeImage={removeImage}

              />
                <ImageUploadRow
                cellIndex={cellIndexRow1}
                images={imagesRow2}
                createHandleFileInput={createHandleFileInputRow2}
                createOnDropHandler={createOnDropHandlerRow2}
                imageScales={imageScalesRow2}
                backgroundColor="#e3dddd"
                zoomIn={zoomInRow2}
                zoomOut={zoomOutRow2}
                isDownloading={isDownloading}
                removeImage={removeImageRow2}
              />
                </div>
              </Fragment>

          ) : (
         <div >
          {colIndex === 0 && rowIndex >= 0 && (
  
  <Button className="zoom-in-button" onClick={() => splitColumn(rowIndex, colIndex)}>+</Button>
            
)}
          {colIndex === 0 && rowIndex >= 0 && (
  
  <Button className="zoom-out-button" onClick={() => deleteColumn(rowIndex, colIndex)}>-</Button>
            
)}

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
                top: '50%',
                left: '50%',
                width:"100%",
                maxHeight:"100%",
                transform: 'translate(-50%, -50%)',
                display: images[cellIndex] ? 'none' : 'flex',
              }}
              multiple={false}
              onDrop={createOnDropHandler(cellIndex)}
            >
              <InboxOutlined style={{ fontSize: '18px' }}/>
            </Upload.Dragger>
            <Button className="button-split" style={{backgroundColor:"black",borderColor:"black"}} onClick={() => toggleDiv(rowIndex, colIndex)}>Split</Button>
            
            {images[cellIndex] && (
             <div
             className="image-container"
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '100%',
               height: '100%',
             }}
           >
             <img
               src={images[cellIndex]}
               alt=""
               style={{
                 width: '100%',
                 height: '100%',
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
               className="remove-image-btn"
               onClick={removeImage(cellIndex)}
             >
               Remove
             </button>
             
           </div>
             )}
            </div>

)}
        
        </Col>
        
      );
      cellIndex++;
      cellIndexRow1++;
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
    axios.post("http://xlabk8s3.cse.buffalo.edu:30012/photo_collage/", formData)    
    //axios.post(process.env.REACT_APP_COLLAGE_API_URL+'/photo_collage/', formData)
      .then(response => {
      }
      )
      .catch(error => {console.log(error); toast.error("Error encountered.");}); 

  const zoomInButtons = document.querySelectorAll(".zoom-in-button");
  const zoomOutButtons = document.querySelectorAll(".zoom-out-button");
      const removeButtons = document.querySelectorAll(".remove-image-btn");

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