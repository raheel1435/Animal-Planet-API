// ==============================
// IMPORTS
// ==============================

// Import Express framework to create the server and API
import express from "express";

// Import MongoClient to connect Node.js with MongoDB
import { MongoClient } from "mongodb";

// Import CORS middleware
// CORS allows your API to be accessed from other origins
// (e.g., frontend running on a different port or domain)
import cors from "cors";

// Import image-related routes from routes/images.js
// This file contains all /api/images endpoints
import imageRoutes from "./routes/images.js";


// ==============================
// EXPRESS APP INITIALIZATION
// ==============================

// Create an Express application instance
const app = express();

/*
Middleware section:
Middleware runs BEFORE routes and processes incoming requests
*/

// Enable CORS so frontend apps can access this API
app.use(cors());

// Enable parsing of JSON request bodies
// Without this, req.body would be undefined for JSON data
app.use(express.json());

/*
Serve static files from the "uploads" folder

This means:
If a browser requests:
http://localhost:3000/uploads/example.jpg

Express will return:
uploads/example.jpg from your project folder
*/
app.use("/uploads", express.static("uploads"));


// ==============================
// CONFIGURATION VARIABLES
// ==============================

// Port number where the server will run
const PORT = 3000;

// MongoDB connection URL
// 127.0.0.1 means "this computer"
// 27017 is MongoDB's default port
const MONGO_URL = "mongodb://127.0.0.1:27017";

// Name of the MongoDB database
// MongoDB creates it automatically if it doesn't exist
const DB_NAME = "imageDB";


// ==============================
// MONGODB CLIENT SETUP
// ==============================

// Create a MongoClient instance
// This does NOT connect yet — it just prepares the client
const client = new MongoClient(MONGO_URL);

// Exported database variable
// This will be assigned AFTER connection
// Other files (like images.js) import and use this
export let db;


// ==============================
// SERVER START FUNCTION
// ==============================

/*
This function:
1. Connects to MongoDB
2. Stores the database connection
3. Registers routes
4. Starts the Express server

It is marked async because MongoDB connection is asynchronous
*/
async function startServer() {

    /*
    client.connect():
    - Establishes a connection to MongoDB
    - Returns a Promise

    await:
    - Pauses execution until MongoDB is connected
    - Prevents routes from running before DB is ready
    */
    await client.connect();

    /*
    Select the database by name

    client.db(DB_NAME):
    - If DB exists → connects to it
    - If DB does NOT exist → MongoDB creates it automatically
    */
    db = client.db(DB_NAME);

    console.log("MongoDB connected");

    /*
    Register image routes

    This means:
    Any request starting with:
    /api/images

    Will be handled by imageRoutes
    */
    app.use("/api/images", imageRoutes);

    /*
    Start the HTTP server

    app.listen():
    - Makes the server listen for incoming requests
    - PORT defines where it listens
    */
    app.listen(PORT, () =>
        console.log(`server running on http://localhost:${PORT}`)
    );
}


// ==============================
// START THE SERVER
// ==============================

// Call the function to start everything
startServer();
