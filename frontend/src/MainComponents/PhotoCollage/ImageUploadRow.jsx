// ImageUploadRow.jsx
import React from 'react';
import { Row, Col, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const ImageUploadRow = ({
  cellIndex,
  images,
  createHandleFileInput,
  createOnDropHandler,
  imageScales,
  backgroundColor,
  zoomIn,
  zoomOut,
  isDownloading,
  removeImage
}) => (
  <Row key={cellIndex} style={{ height: '50%', width: '100%', overflowY: 'auto', backgroundColor, border: "0.5px solid black" }}>
    <Col span={24} style={{ padding: 0, maxHeight: '100%', maxWidth: '100%' }}>
      <div style={{ overflow: 'auto', position: 'relative', height: '100%' }}>
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
            width: '100%',
            height: '100%',
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
    </Col>
  </Row>
);

export default ImageUploadRow;
