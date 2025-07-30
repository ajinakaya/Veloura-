const Jewelry = require('../models/jewelry');

// Create Jewelry
const createJewelry = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      sizes,
      category,
      materials,
      details,
      colorOptions,
      tags,
      sizeGuide
    } = req.body;

    const thumbnail = req.files?.thumbnail?.[0]?.path || null;
    const allImages = req.files?.jewelryImages?.map(file => file.path) || [];

    const parsedColorOptions = JSON.parse(colorOptions || "[]");
    const processedColorVariants = parsedColorOptions.map((variant, index) => {
      const imagesPerVariant = Math.ceil(allImages.length / parsedColorOptions.length);
      const startIndex = index * imagesPerVariant;
      const endIndex = startIndex + imagesPerVariant;
      const variantImages = allImages.slice(startIndex, endIndex);

      return {
        color: variant.color,
        colorCode: variant.colorCode || null,
        jewelryImages: variantImages,
      };
    });

    const parsedMaterials = JSON.parse(materials || "[]");
    const parsedDetails = JSON.parse(details || "[]");

    const jewelry = new Jewelry({
      name,
      description,
      price,
      sizes: JSON.parse(sizes || "[]"),
      thumbnail,
      category,
      materials: parsedMaterials,
      details: parsedDetails,
      colorOptions: processedColorVariants,
      tags: JSON.parse(tags || "[]"),
      sizeGuide: sizeGuide || null,
    });

    await jewelry.save();
    res.status(201).json({ message: "Jewelry created successfully", jewelry });
  } catch (error) {
    console.error("Error creating jewelry:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Jewelry
const getAllJewelry = async (req, res) => {
  try {
    const jewelry = await Jewelry.find()
      .populate("category")
      .populate("sizeGuide");
    res.json(jewelry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Jewelry by ID
const getJewelryById = async (req, res) => {
  try {
    const jewelry = await Jewelry.findById(req.params.id)
      .populate("category")
      .populate("sizeGuide");
    if (!jewelry) return res.status(404).json({ message: "Jewelry not found" });
    res.json(jewelry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Jewelry
const updateJewelry = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Jewelry.findById(id);
    if (!existing) return res.status(404).json({ message: "Jewelry not found" });

    const data = req.body;

    for (let field of ["name", "description", "price", "category", "sizeGuide"]) {
      if (data[field]) existing[field] = data[field];
    }

    if (data.sizes) {
      existing.sizes = JSON.parse(data.sizes);
    }

    if (data.details) {
      existing.details = JSON.parse(data.details);
    }

    if (data.materials) {
      existing.materials = JSON.parse(data.materials);
    }

    if (data.tags) {
      existing.tags = JSON.parse(data.tags);
    }

    if (req.files?.thumbnail?.[0]) {
      existing.thumbnail = req.files.thumbnail[0].path;
    }

    if (data.colorOptions) {
      const parsedColorOptions = JSON.parse(data.colorOptions);
      const allImages = req.files?.jewelryImages?.map(file => file.path) || [];

      const processedColorVariants = parsedColorOptions.map((variant, index) => {
        const imagesPerVariant = Math.ceil(allImages.length / parsedColorOptions.length);
        const startIndex = index * imagesPerVariant;
        const endIndex = startIndex + imagesPerVariant;
        const variantImages = allImages.slice(startIndex, endIndex);

        return {
          color: variant.color,
          colorCode: variant.colorCode || null,
          jewelryImages: variantImages,
        };
      });

      existing.colorOptions = processedColorVariants;
    }

    await existing.save();
    res.json({ message: "Jewelry updated", jewelry: existing });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Jewelry
const deleteJewelry = async (req, res) => {
  try {
    const deleted = await Jewelry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Jewelry not found" });
    res.json({ message: "Jewelry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJewelry,
  getAllJewelry,
  getJewelryById,
  updateJewelry,
  deleteJewelry,
};
