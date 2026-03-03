import express from "express";      
import multer from "multer";        
import { db } from "../server.js";  
import { ObjectId } from "mongodb"; 

const router = express.Router();    

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Post route to handle image upload and metadata saving
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded" });
        }

        const imageData = {
            name: req.body.name,               
            type: req.body.type,               
            description: req.body.description, 
            color: req.body.color || "",       
            lifeSpan: req.body.lifeSpan || "",  
            imagePath: `/uploads/${req.file.filename}`,
            createdAt: new Date()
        };

        const result = await db
            .collection("images")  
            .insertOne(imageData);

        return res.status(201).json({
            message: "Image Created",
            id: result.insertedId
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all images

router.get("/", async (req, res) => {
    try {
        const images = await db
            .collection("images")
            .find()
            .toArray();

         return res.status(200).json(images); 
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Get single image by ID

router.get("/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const image = await db
            .collection("images")
            .findOne({
                _id: new ObjectId(req.params.id) 
            });
            
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        return res.status(200).json(image);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Put route to Update or Create (RFC2616)

router.put("/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const id = new ObjectId(req.params.id);

        const updateData = {
            name: req.body?.name || "",
            type: req.body?.type || "",
            description: req.body?.description || "",
            color: req.body?.color || "",
            lifeSpan: req.body?.lifeSpan || ""
        };

        const result = await db.collection("images").updateOne(
            { _id: id },
            { $set: updateData },
            { upsert: true }
        );

        // if document was created
        if (result.upsertedCount === 1) {
            return res.status(201).json({ message: "Image created" });
        }

        // if document was updated
        return res.status(200).json({ message: "Image updated" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Delete Remove images

router.delete("/:id", async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const result = await db.collection("images").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Image not found" });
        }

        return res.status(200).json({ message: "Image deleted" });
    } catch (err) {
        return res.status(500).json({ message: err.message });      
    }
});

export default router;
