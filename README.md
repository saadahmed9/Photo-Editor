## cse611-spring2023-team-alpha ##
* photo editing




APIs URL information: 

1.Mosaic - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/mosaic_maker/: Creates a template out of input images based on the template selected

2.Passport creation - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/passport_photo_size/: Creates passport size photo along with other optional constraints such as specs required or not, minimalistic features applied on pictures or not

3.Format change - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/format_change/: Changes the image format based on user selection

4.Background change - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/background_change/: Changes the background color of the image to the one selected by user

5.Resize - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/resize/: Changes the dimensions of the images based on the user input

6.Noise removal - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/noise_removal/: Removes noise from the given input image

7.Pdf maker - https://application-79.11p5m57if4on.us-east.codeengine.appdomain.cloud/pdf_maker/: Collages input images to a PDF file.

Local Setup
Git clone using the command
git clone git@github.com:xlab-classes/cse611-fall-2023-team-photoedting.git
or
git clone https://github.com/xlab-classes/cse611-fall-2023-team-photoedting.git

Backend (Using powershell)
- Copy the models to backend\photo_editing_api\media\models\
- cd into backend\photo_editing_api\
- Create virtual environment - python -m venv venv  (creates venv folder)
- Activate virtual environment - .\venv\Scripts\Activate.ps1
- pip install -r .\requirements.txt
- Finally run the python manage.py runserver -- This will throw error
- Navigate to line 15 in deeplab.py file (This is a library downloaded after pip install). Update 'from tensorflow.python.keras.layers import BatchNormalization' to 'from tensorflow.keras.layers import BatchNormalization'
- Now it should provide the address it is hosting

frontend
- cd frontend\
- npm install
- npm start