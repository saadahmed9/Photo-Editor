import cv2

def noiseremoval(input_path,output_path):
    img = cv2.imread(input_path)
    bilateral = cv2.bilateralFilter(img, 15, 75, 75)
    cv2.imwrite(output_path, bilateral)



