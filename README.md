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

Setting Up Backend
1. Copy Model Files
Place your model files into the backend\photo_editing_api\media\models\ directory.
2. Navigate to Project Directory
Open PowerShell.
Use the cd command to navigate to your project’s backend directory.
bash
Copy code
cd path\to\backend\photo_editing_api\
3. Virtual Environment Setup
If a virtual environment hasn't been created:
bash
Copy code
python -m venv venv
Activate the virtual environment:
powershell
Copy code
.\venv\Scripts\Activate.ps1
4. Install Dependencies
Install the required dependencies from the requirements.txt file.
bash
Copy code
pip install -r .\requirements.txt
For dlib installation errors, ensure the necessary Visual Studio components are installed. If the issue persists, consider installing dlib separately or using a pre-built binary.
5. Code Modification (if necessary)
Navigate to deeplab.py and make necessary changes as per instructions. For instance, update the import statement on line 15.
6. Run Development Server
After installing dependencies and making modifications, run the Django development server:
bash
Copy code
python manage.py runserver
The server should start, and you'll see an address in the console (usually http://127.0.0.1:8000/ or http://localhost:8000/).
Testing Setup
Navigate to the provided address in a web browser. You should see the Django server's welcome page or your project's home page.
Troubleshooting
For errors, refer to the console output for clues.
Ensure compatibility of Python environment and packages with the project requirements.
Possible Issues & Solutions
Issue: Import error for BatchNormalization from tensorflow.python.keras.layers.
Solutions:
Check TensorFlow version:
bash
Copy code
pip show tensorflow
Modify import statements in deeplab.py (or another file) based on TensorFlow version:
python
Copy code
from tensorflow.keras.layers import BatchNormalization  # TensorFlow 2.x
# or
from keras.layers import BatchNormalization  # TensorFlow 1.x
Install a specific TensorFlow version if necessary:
bash
Copy code
pip install tensorflow==<specific_version>
Additional Notes
Restart virtual environment or terminal session after installing or upgrading TensorFlow.
Reinstall or upgrade packages as needed for compatibility with TensorFlow version.
Always activate the virtual environment before any installations or upgrades.
Final Steps
After making changes, run the server again:
bash
Copy code
python manage.py runserver
Monitor the console for errors or warnings and address them as needed.

frontend
- cd frontend\
- npm install
- npm start
