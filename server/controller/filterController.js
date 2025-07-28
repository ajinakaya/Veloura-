const Jewelry = require("../models/jewelry");
const Category = require("../models/category");


// Search Jewelry
const searchJewelry = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ error: "Search query is required" });

    const categoryMatches = await Category.find({
      category: { $regex: search, $options: "i" },
    }).select("_id");


    const results = await Jewelry.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { category: { $in: categoryMatches.map((c) => c._id) } },
        
      ],
    })
      .populate("category");

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Filter Jewelry
const filterJewelry = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      color,
      tag,
      category,
      size,
      sortBy,
      sortOrder = "asc",
    } = req.query;

    const filter = {};

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (color) {
      filter["colorOptions.color"] = { $regex: color, $options: "i" };
    }

    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (size) filter.size = size;

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const filtered = await Jewelry.find(filter)
      .populate("category")
      .sort(sortOptions);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Jewelry by Tag
const getJewelryByTag = async (req, res) => {
  try {
    const { tagName } = req.params;

    const jewelry = await Jewelry.find({ tags: tagName })
      .populate("category")


    res.status(200).json(jewelry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Available Jewelry Colors
const getAvailableJewelryColors = async (req, res) => {
  try {
    const jewelry = await Jewelry.find({}, "colorOptions");

    const colorMap = new Map();

    jewelry.forEach((item) => {
      if (item.colorOptions && item.colorOptions.length > 0) {
        item.colorOptions.forEach((colorOption) => {
          if (colorOption.color && colorOption.colorCode) {
            const colorKey = colorOption.color.toLowerCase();
            if (!colorMap.has(colorKey)) {
              colorMap.set(colorKey, {
                name: colorOption.color,
                code: colorOption.colorCode,
              });
            }
          }
        });
      }
    });

    const uniqueColors = Array.from(colorMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.status(200).json(uniqueColors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAvailableJewelrySizes = async (req, res) => {
  try {
    const jewelry = await Jewelry.find({}, "sizes");

    const sizeSet = new Set();

    jewelry.forEach((item) => {
      if (item.sizes && Array.isArray(item.sizes)) {
        item.sizes.forEach((size) => sizeSet.add(size));
      }
    });

    const uniqueSizes = Array.from(sizeSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    res.status(200).json(uniqueSizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  searchJewelry,
  filterJewelry,
  getJewelryByTag,
  getAvailableJewelryColors,
  getAvailableJewelrySizes,
};
