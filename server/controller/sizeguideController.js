import SizeGuide from '../models/sizeguide.js';


// CREATE a new SizeGuide
const createSizeGuide = async (req, res) => {
    try {
        const { name, description, sizeDetails } = req.body;

        let parsedSizeDetails = [];
        try {
            parsedSizeDetails = JSON.parse(sizeDetails || "[]");
        } catch (err) {
            console.error("Error parsing sizeDetails JSON for creation:", err);
            return res.status(400).json({ message: 'Invalid format for size details. Must be valid JSON string.', error: err.message });
        }

        const images = req.files && req.files.images ? req.files.images.map(file => file.path) : [];

        const newGuide = new SizeGuide({
            name,
            description,
            images, 
            sizeDetails: parsedSizeDetails,
        });

        await newGuide.save();
        res.status(201).json(newGuide);
    } catch (error) {
        console.error("Backend Error in createSizeGuide:", error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        // Send a more descriptive error message to the client
        res.status(500).json({ message: 'Error creating size guide', error: error.message || 'An unknown error occurred on the server.' });
    }
};

// GET all SizeGuides
const getAllSizeGuides = async (req, res) => {
    try {
        const guides = await SizeGuide.find().sort({ createdAt: -1 });
        res.status(200).json(guides);
    } catch (error) {
        console.error("Backend Error fetching all size guides:", error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        res.status(500).json({ message: 'Error fetching size guides', error: error.message || 'An unknown error occurred on the server.' });
    }
};

// GET a single SizeGuide by ID
const getSizeGuideById = async (req, res) => {
    try {
        const guide = await SizeGuide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ message: 'Size guide not found' });
        }
        res.status(200).json(guide);
    } catch (error) {
        console.error(`Backend Error fetching size guide with ID ${req.params.id}:`, error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        res.status(500).json({ message: 'Error fetching size guide', error: error.message || 'An unknown error occurred on the server.' });
    }
};

// UPDATE a SizeGuide
const updateSizeGuide = async (req, res) => {
    try {
        const { name, description, sizeDetails } = req.body;
        const guideId = req.params.id;

        let parsedSizeDetails = [];
        try {
            parsedSizeDetails = JSON.parse(sizeDetails || "[]");
        } catch (err) {
            console.error("Error parsing sizeDetails JSON for update:", err);
            return res.status(400).json({ message: 'Invalid format for size details. Must be valid JSON string.', error: err.message });
        }

        const newImages = req.files && req.files.images ? req.files.images.map(file => file.path) : [];

        const existingGuide = await SizeGuide.findById(guideId);
        if (!existingGuide) {
            return res.status(404).json({ message: 'Size guide not found' });
        }

        let imagesToStore = existingGuide.images; 

        if (newImages.length > 0) {
         
            deleteFiles(existingGuide.images);
            imagesToStore = newImages; 
        }
      
        const updatedGuide = await SizeGuide.findByIdAndUpdate(
            guideId,
            {
                name,
                description,
                sizeDetails: parsedSizeDetails,
                images: imagesToStore, 
            },
            { new: true, runValidators: true } 

        );

        if (!updatedGuide) {
            return res.status(404).json({ message: 'Size guide not found' });
        }

        res.status(200).json(updatedGuide);
    } catch (error) {
        console.error(`Backend Error updating size guide with ID ${req.params.id}:`, error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        res.status(500).json({ message: 'Error updating size guide', error: error.message || 'An unknown error occurred on the server.' });
    }
};

// DELETE a SizeGuide
const deleteSizeGuide = async (req, res) => {
    try {
        const guideId = req.params.id;
        const deletedGuide = await SizeGuide.findByIdAndDelete(guideId);

        if (!deletedGuide) {
            return res.status(404).json({ message: 'Size guide not found' });
        }

        if (deletedGuide.images && deletedGuide.images.length > 0) {
            deleteFiles(deletedGuide.images);
        }

        res.status(200).json({ message: 'Size guide deleted successfully' });
    } catch (error) {
        console.error(`Backend Error deleting size guide with ID ${req.params.id}:`, error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        res.status(500).json({ message: 'Error deleting size guide', error: error.message || 'An unknown error occurred on the server.' });
    }
};

export {
    createSizeGuide,
    getAllSizeGuides,
    getSizeGuideById,
    updateSizeGuide,
    deleteSizeGuide,
};