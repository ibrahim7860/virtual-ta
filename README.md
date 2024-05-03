<p align="center">
    <img alt="logo.png" height="500" width="500" src="./src/images/logo.png" width="400"/>
</p>

<h1 align="center">Virtual-TA - A Chatbot for Coding Questions</h1>
<h2 align="center">Virtual-TA is a chatbot designed by students for students to answer coding questions students may have in a chatroom format.</h3>

## Demo Video on How to Use VirtualTA After Installation (For installation -- see video and instructions below for details)
https://github.com/ibrahim7860/virtual-ta/blob/0f5fb5ae41589d648cad9c6bd1338cd217184cf7/demos/Virtual_TA_Demo.mp4

## Demo Video for Installation Instructions
https://github.com/ibrahim7860/virtual-ta/assets/93676578/de987268-084b-4e2d-9178-72d9a7c3ecfc



## Requirements
To run Virtual-TA, you will need the following libraries:

- Python 3.6 - 3.11
- Flask
- Flask-CORS
- jsonpickle
- textwrap
- IPython
- google.generativeai

## Usage
Clone the repository
```
git clone https://github.com/ibrahim7860/virtual-ta.git
```
Run the React app
```
npm install
npm start
```
Start the virtual environment
```
cd backend
virtualenv myenv
```
Windows Do
```
myenv\Scripts\activate
```
Mac/Linux Do
```
source myenv/bin/activate
```
If you are getting a command not found for virtualenv, you might have to preface it with the version you have for python, like 
```
python3 -m virtualenv myenv
```
Install the required libraries
```
pip install -r requirements.txt
```
Run the Flask app
```
flask run
```

## Frontend
The VirtualTA frontend was built using ReactJS, a JavaScript library for building user interfaces, and styled using Vanilla CSS.

## Backend
The VirtualTA backend was built using Python with Flask, a micro web framework. It utilizes the Google Gemini API for chatbot responses, and stores user information, chats, and carries out user authentications via Firebase.

## Slide
<img width="652" alt="Screenshot 2024-04-30 at 11 47 50 AM" src="https://github.com/ibrahim7860/virtual-ta/assets/76620497/7c08a9c3-8df2-456f-aec3-6501cade6ed7">
