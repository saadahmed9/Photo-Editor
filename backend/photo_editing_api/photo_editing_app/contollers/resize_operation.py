import cv2

def image_resize(image,output_url,width, height, inter = cv2.INTER_AREA):
    dim = None
    height = int(height)
    width = int(width)
    image = cv2.imread(image)
#     (h, w) = image.shape[:2]
    h = height
    w = width
    if width is None and height is None:
        return image
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    else:
        r = width / float(w)
        dim = (width, int(h * r))
    resized = cv2.resize(image, dim, interpolation = inter)
    cv2.imwrite(output_url, resized)
    return resized

