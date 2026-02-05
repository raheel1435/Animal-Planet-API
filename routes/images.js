// ==============================
// IMPORTS
// ==============================

import express from "express";      
// Express is a Node.js framework used to build APIs and web servers.
// Here, we use it to define routes like GET, POST, PUT, etc.

import multer from "multer";        
// Multer is middleware used to handle file uploads (images, files, etc.).
// It processes multipart/form-data coming from forms or Postman.

import { db } from "../server.js";  
// Import the MongoDB database connection created in server.js.
// This allows this file to talk to the database.

import { ObjectId } from "mongodb"; 
// ObjectId is a MongoDB-specific data type.
// MongoDB stores document IDs as ObjectId, NOT as plain strings.
// We must convert string IDs into ObjectId before querying.


// ==============================
// ROUTER SETUP
// ==============================

const router = express.Router();    
// A router is like a mini version of `app`.
// It helps organize routes into separate files.


// ==============================
// MULTER CONFIGURATION
// ==============================

/*
This block configures HOW uploaded files are stored.

Two things are defined:
1. destination → where files will be saved
2. filename    → how files will be named
*/

const storage = multer.diskStorage({

    // Folder where uploaded files will be stored
    destination: "uploads/",

    /*
    filename function decides the name of the uploaded file.

    Parameters:
    - req  → request object
    - file → uploaded file info
    - cb   → callback function (used to return the filename)
    */
    filename: (req, file, cb) => {

        /*
        cb(error, filename)

        - null means "no error"
        - Date.now() ensures unique filenames
        - file.originalname keeps the original filename
        */
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Create Multer middleware using the above storage rules
const upload = multer({ storage });


// ==============================
// POST /api/images
// ==============================

/*
PURPOSE:
- Upload an image file
- Save image metadata in MongoDB

FLOW:
Client (Postman / HTML form)
→ Express
→ Multer (stores file)
→ MongoDB (stores data)
*/

router.post("/", upload.single("image"), async (req, res) => {
    /*
    upload.single("image"):
    - Tells Multer to expect ONE file
    - The file field name must be "image"
    - The uploaded file becomes available as req.file
    */

    try {
        // Create an object that will be stored as a MongoDB document
        const imageData = {
            name: req.body.name,               // Text field from form
            type: req.body.type,               // Animal type
            description: req.body.description, // Description text
            color: req.body.color || "",       // Optional field
            lifeSpan: req.body.lifeSpan || "", // Optional field
            
            /*
            Image file path saved in DB
            This path is used later to display the image
            */
            imagePath: `/uploads/${req.file.filename}`,

            // Timestamp when document is created
            createdAt: new Date()
        };

        /*
        insertOne():
        - MongoDB method
        - Inserts ONE document into the "images" collection
        - Returns a Promise
        */
        const result = await db
            .collection("images")  // Select "images" collection
            .insertOne(imageData); // Insert the document

        /*
        result looks like:
        {
          acknowledged: true,
          insertedId: ObjectId("...")
        }
        */

        res.status(201).json(result); // Send success response

    } catch (err) {
        // If any error happens, send error message
        res.status(500).json({ message: err.message });
    }
});


// ==============================
// GET /api/images
// ==============================

/*
PURPOSE:
- Fetch ALL images from MongoDB
*/

router.get("/", async (req, res) => {
    try {
        /*
        find():
        - Fetches documents
        - Returns a cursor (not actual data yet)

        toArray():
        - Converts cursor into an array
        */
        const images = await db
            .collection("images")
            .find()
            .toArray();

        res.json(images); // Send array of images

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ==============================
// GET /api/images/:id
// ==============================

/*
PURPOSE:
- Fetch ONE image by its MongoDB ID
*/

router.get("/:id", async (req, res) => {
    try {
        /*
        req.params.id:
        - Value taken from the URL
        Example:
        /api/images/65abc123
        req.params.id === "65abc123"
        */

        const image = await db
            .collection("images")
            .findOne({
                _id: new ObjectId(req.params.id) // Convert string → ObjectId
            });

        // If no document is found
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.json(image); // Send image data

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ==============================
// PUT /api/images/:id
// ==============================

/*
PURPOSE:
- Update text data of an image
- DOES NOT update the image file itself
*/

router.put("/:id", async (req, res) => {
    try {
        /*
        updateOne():
        - Updates ONE document
        - Takes TWO arguments:
          1. Filter → which document
          2. Update → what to change
        */

        const result = await db
            .collection("images")
            .updateOne(

                // FILTER: which document to update
                { _id: new ObjectId(req.params.id) },

                // UPDATE: what fields to change
                {
                    $set: {
                        name: req.body.name,
                        type: req.body.type,
                        description: req.body.description,
                        color: req.body.color,
                        lifespan: req.body.lifespan
                    }
                }
            );

        /*
        result contains:
        - matchedCount
        - modifiedCount
        */

        res.json(result); // Send update result

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ==============================
// EXPORT ROUTER
// ==============================

export default router;
// This allows server.js to use these routes
