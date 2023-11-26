import cv2
import numpy as np
import dlib
from photo_editing_api.settings import MODEL_DIR

def drawPoints(image, faceLandmarks, startpoint, endpoint, isClosed=False):
  points = []
  for i in range(startpoint, endpoint+1):
    point = [faceLandmarks.part(i).x, faceLandmarks.part(i).y]
    points.append(point)

  points = np.array(points, dtype=np.int32)
  cv2.polylines(image, [points], isClosed, (255, 200, 0), thickness=2, lineType=cv2.LINE_8)

def facePoints(image, faceLandmarks):
    assert(faceLandmarks.num_parts == 68)
    drawPoints(image, faceLandmarks, 0, 16)           # Jaw line
    drawPoints(image, faceLandmarks, 17, 21)          # Left eyebrow
    drawPoints(image, faceLandmarks, 22, 26)          # Right eyebrow
    drawPoints(image, faceLandmarks, 27, 30)          # Nose bridge
    drawPoints(image, faceLandmarks, 30, 35, True)    # Lower nose
    drawPoints(image, faceLandmarks, 36, 41, True)    # Left eye
    drawPoints(image, faceLandmarks, 42, 47, True)    # Right Eye
    drawPoints(image, faceLandmarks, 48, 59, True)    # Outer lip
    drawPoints(image, faceLandmarks, 60, 67, True)    # Inner lip


def writeFaceLandmarksToLocalFile(faceLandmarks, fileName):
  with open(fileName, 'w') as f:
    for p in faceLandmarks.parts():
      f.write("%s %s\n" %(int(p.x),int(p.y)))
  f.close()

# Model_PATH = MODEL_DIR + "shape_predictor_68_face_landmarks.dat"
Model_PATH = "media/models/shape_predictor_68_face_landmarks.dat"
frontalFaceDetector = dlib.get_frontal_face_detector()
faceLandmarkDetector = dlib.shape_predictor(Model_PATH)


def passport_photo_face(image,output_url):
    img= cv2.imread(image)
    imageRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    allFaces = frontalFaceDetector(imageRGB, 0)
    allFacesLandmark = []

    for k in range(0, len(allFaces)):
      faceRectangleDlib = dlib.rectangle(int(allFaces[k].left()),int(allFaces[k].top()),
          int(allFaces[k].right()),int(allFaces[k].bottom()))
      detectedLandmarks = faceLandmarkDetector(imageRGB, faceRectangleDlib)
      if k==0:
          pass
      allFacesLandmark.append(detectedLandmarks)
      facePoints(img, detectedLandmarks)
      cv2.imwrite(output_url, img)
      if len(detectedLandmarks.parts()) == 68 :
          return "Face detected"
      elif len(detectedLandmarks.parts())>0 and len(detectedLandmarks.parts())<68:
          return "Full Face was not detected"
      else:
          return "No Face Detected"
    return "No Face Detected"
