from PIL import Image

def convert_images_to_pdf(images_folder, pdf_file):
    images = []
    #print("Images folder is", images_folder)
    for file in images_folder:
        if file.endswith(".jpg") or file.endswith(".png") or file.endswith(".jpeg"):

            image = Image.open(file)
            print("Printing image information before", image)
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            images.append(image)
            print("Printing image information", image)
    print("Appended images are as below")
    print(images)
    images[0].save(pdf_file, save_all=True, append_images=images[1:])

