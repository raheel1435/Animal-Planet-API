🐾 Animal Planet Image API

This project is a beginner-level REST API built with Node.js, Express, MongoDB, and Multer.
It allows users to upload images with data, store metadata in MongoDB, and retrieve images and data using HTTP requests.

This README explains how to run and use the project, not the internal code logic.

Tested Environment
Tested on: Windows 10, Node.js v22, MongoDB Community Server

This project was tested locally using Postman and MongoDB Compass.



📦 Required Software (Install First)

Before starting, make sure the following software is installed on your computer:

1. Node.js

Download: https://nodejs.org

Check installation:

node -v (v22.21.1)
npm -v  (10.9.4)


2. MongoDB Community Server

Download: https://www.mongodb.com/try/download/community

MongoDB must be running locally on:

mongodb://127.0.0.1:27017

3. MongoDB Compass (Recommended)

Visual tool to see databases and collections

Download: https://www.mongodb.com/try/download/compass

4. Postman

Used to test API requests (GET, POST, PUT)

Download: https://www.postman.com/downloads/

📁 Project Structure Overview

After setup, your project will look like this:

Animal-Planet-API/
│
├── server.js
├── package.json
├── routes/
│   └── images.js
├── uploads/        ← created automatically
├── node_modules/
└── README.md

⚙️ Initial Setup (First Time Only)
Step 1: Open Terminal / PowerShell

Navigate to the project folder:

cd path/to/Animal-Planet-API

Step 2: Initialize Node Project
npm init -y (This creates package.json.)

Step 3: Install Dependencies
npm install express mongodb multer cors

📄 Important: "type": "module" in package.json

In package.json:
"type": "module"
Why this is needed:
Allows modern ES module syntax:
import express from "express";

Without it, Node.js expects require() instead
Prevents module warnings and import errors


▶️ Starting the Server
Start MongoDB

MongoDB must be running before starting the server.

Start the API Server by command in terminal (cmd):
npm start

or

node server.js


Expected Output:
MongoDB connected
server running on http://localhost:3000


📂 Uploads Folder (Automatic)

You do not create the uploads folder manually. It appears automatically when the first image is uploaded.

Images are saved here by Multer
Images are publicly accessible via:
http://localhost:3000/uploads/filename.jpg

🧪 Using Postman (Step by Step)
Base URL
http://localhost:3000/api/images

➕ POST – Upload Image + Data
Purpose

Upload an image

Save image info in MongoDB

Save image file in /uploads

Method
POST

URL
http://localhost:3000/api/images

➕ POST – Body + Form-data

 | Key         | Type | Value                             | Description          |
| ----------- | ---- | --------------------------------- | -------------------- |
| image       | File | White-Reindeer.jpg                | Image file to upload |
| name        | Text | toucan                            | Animal name          |
| type        | Text | bird                              | Animal type/category |
| color       | Text | black with colorful beak          | Dominant colors      |
| description | Text | A tropical bird with a large beak | Short description    |
| lifespan    | Text | 15–20 years                       | Average lifespan     |

after all information and image (must press upload), press on send button infront of port:URL. this will upload image and its data.

Expected Response
{
  "acknowledged": true,
  "insertedId": "..."
}

📥 GET – Fetch All Images
Purpose

Retrieve all stored image data

Method
GET

URL
http://localhost:3000/api/images

Response

Array of image objects

Includes image path and metadata

🔍 GET by ID – Fetch One Image
Method
GET

URL
http://localhost:3000/api/images/{id}

Example
http://localhost:3000/api/images/65abc123...

✏️ PUT – Update Image Data (No File Upload)
Purpose

Update text fields only

Image file remains unchanged

Method
PUT

URL
http://localhost:3000/api/images/{id}

Body → JSON
{
  "name": "Updated Name",
  "type": "Mammal",
  "description": "Updated description"
}

🗄️ MongoDB: What to Expect
Database

Name: imageDB

Created automatically on first insert

Collection

Name: images

Created automatically

Documents

Contain:

text data

image path

timestamps

Images themselves are NOT stored in MongoDB

Only file paths are stored

🔁 When to Restart the Server

Restart the server when:

You change server.js

You change route files

You install new npm packages

Command:

Ctrl + C
npm start

🚫 Common Beginner Mistakes (Avoid These)

Sending image data using GET instead of POST

Forgetting form-data in Postman

Using wrong key name (image must match)

MongoDB not running

Expecting data to appear in package.json

Uploading files before server is running

📌 Summary

This API allows:

Image uploads via POST

Data storage via MongoDB

Image hosting via Express static files

Data retrieval via GET

Data updates via PUT

It is designed for learning purposes, clarity, and assignment submission.

this repo "https://github.com/raheel1435/Animal-Planet-with-API.git (for git clone)"
"https://raheel1435.github.io/Animal-Planet-with-API/  (to view webpage)" is running on the same API.
to test the results user need to connect the mongodb and also need to run server in terminal by "npm start" command.