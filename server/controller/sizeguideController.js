import SizeGuide from '../models/sizeguide.js';

// CREATE a new SizeGuide
const createSizeGuide = async (req, res) => {
  try {
    const { name, description, sizeDetails } = req.body;

    let parsedSizeDetails = [];
    if (typeof sizeDetails === 'string') {
      parsedSizeDetails = JSON.parse(sizeDetails);
    } else {
      parsedSizeDetails = sizeDetails;
    }

    const images = req.files?.map(file => file.path) || [];

    const newGuide = new SizeGuide({
      name,
      description,
      images,
      sizeDetails: parsedSizeDetails,
    });

    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error creating size guide', error });
  }
};

// GET all SizeGuides
const getAllSizeGuides = async (req, res) => {
  try {
    const guides = await SizeGuide.find().sort({ createdAt: -1 });
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching size guides', error });
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
    res.status(500).json({ message: 'Error fetching size guide', error });
  }
};

// UPDATE a SizeGuide
const updateSizeGuide = async (req, res) => {
  try {
    const { name, description, sizeDetails } = req.body;

    let parsedSizeDetails = [];
    if (typeof sizeDetails === 'string') {
      parsedSizeDetails = JSON.parse(sizeDetails);
    } else {
      parsedSizeDetails = sizeDetails;
    }

    const images = req.files?.map(file => file.path) || [];

    const updatedGuide = await SizeGuide.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        $push: { images: { $each: images } }, // Add new images to the array
        sizeDetails: parsedSizeDetails,
      },
      { new: true }
    );

    if (!updatedGuide) {
      return res.status(404).json({ message: 'Size guide not found' });
    }

    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(500).json({ message: 'Error updating size guide', error });
  }
};

// DELETE a SizeGuide
const deleteSizeGuide = async (req, res) => {
  try {
    const deleted = await SizeGuide.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Size guide not found' });
    }
    res.status(200).json({ message: 'Size guide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting size guide', error });
  }
};

export {
  createSizeGuide,
  getAllSizeGuides,
  getSizeGuideById,
  updateSizeGuide,
  deleteSizeGuide,
};
