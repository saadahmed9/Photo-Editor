import numpy as np
import dlib
import cv2
from PIL import Image
from photo_editing_api.settings import MODEL_DIR

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("media/models/shape_predictor_68_face_landmarks.dat")

def spects_detector(image):
    img = dlib.load_rgb_image(image)
    if len(detector(img)) == 0:
        return ('No face detected')
    rect = detector(img)[0]
    sp = predictor(img, rect)
    landmarks = np.array([[p.x, p.y] for p in sp.parts()])
    nose_bridge_x = []
    nose_bridge_y = []
    for i in [28, 29, 30, 31, 33, 34, 35]:
        nose_bridge_x.append(landmarks[i][0])
        nose_bridge_y.append(landmarks[i][1])
    x_min = min(nose_bridge_x)
    x_max = max(nose_bridge_x)
    y_min = landmarks[20][1]
    y_max = landmarks[30][1]
    img2 = Image.open(image)
    img2 = img2.crop((x_min, y_min, x_max, y_max))
    img_blur = cv2.GaussianBlur(np.array(img2), (3, 3), sigmaX=0, sigmaY=0)
    edges = cv2.Canny(image=img_blur, threshold1=100, threshold2=200)
    edges_center = edges.T[(int(len(edges.T) / 2))]
    if 255 in edges_center:
        return "Face detected with specs"
    else:
        return "Face detected without specs"