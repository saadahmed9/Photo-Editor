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

## Setting Up Backend

### 1. Copy Model Files
Move model files to `backend/photo_editing_api/media/models/`.
For FFMPEG, perform the following steps as mentioned
- In Windows : 
    - Download the release version of ffmpeg via the link - https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.7z 
    - Extract, copy to any location of your choice and copy the path to the bin folder (Eg - C:\ffmpeg\bin)
    - In Start menu, search for Environment Variables (User / System) and Edit PATH variable to include the above ffmpeg bin path
    - Restart the Terminal and verify ffmpeg command runs successfully.
- In linux : sudo apt install ffmpeg 

### 2. Navigate to Project Directory
Open your terminal or PowerShell and navigate using:
```bash
cd path\to\backend\photo_editing_api\
```

### 3. Setup Virtual Environment
If not already created, initialize a virtual environment and activate it:

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1 # Windows

source venv/bin/activate  # MacOS/Linux
```

### 4. Install Dependencies
Install dependencies from requirements.txt. For dlib errors, ensure Visual Studio components are installed or install dlib separately.
```bash
pip install -r requirements.txt
```
### 5. Run Development Server
Start the Django server using:
```bash
python manage.py runserver
```

Access the server at http://127.0.0.1:8000/ or http://localhost:8000/.

### Testing Setup
Navigate to the server address in a browser to view the Django welcome page or project home page.

### Troubleshooting
Refer to console output for error details.

Ensure Python environment and package compatibility.

### Possible Issues & Solutions
-Issue: BatchNormalization 

import error from tensorflow.python.keras.layers.

Solutions:
Check TensorFlow version: 
```bash
pip show tensorflow.
```

-Adjust import statements in deeplab.py:
from tensorflow.keras.layers import BatchNormalization  # TensorFlow 2.x
or
from keras.layers import BatchNormalization  # TensorFlow 1.x

Install specific TensorFlow version: 
pip install tensorflow==<specific_version>.

### Additional Notes
-Restart the virtual environment after TensorFlow installation or upgrade.

-Always activate the virtual environment before installations or upgrades.

### Final Steps
Run the server again after making changes and monitor the console for errors or warnings.
```bash
python manage.py runserver
```


## Setting Up Frontend

Navigate to the `frontend` directory and install the necessary packages, then start the server:

```bash
cd frontend
npm install
npm start

