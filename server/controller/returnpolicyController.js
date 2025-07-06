const ReturnPolicy = require("../models/returnpolicy");

// Create Return Policy
const createReturnPolicy = async (req, res) => {
  try {
    const {title, description, duration, conditions } = req.body;
    const icon = req.file ? req.file.path : null;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: "Title and Description are required." });
    }


    const returnPolicy = await ReturnPolicy.create({
      title,
      description,
      duration: duration || "30 Days",
      icon,
      conditions,
    });

    res.status(201).json({ message: "Return policy created successfully", returnPolicy });
  } catch (error) {
    console.error("Error creating return policy:", error);
    res.status(500).json({ error: "Something went wrong while creating return policy." });
  }
};

module.exports = {
  createReturnPolicy,
};

// Get all return policies
const getAllReturnPolicies = async (req, res) => {
  try {
    const policies = await ReturnPolicy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Update return policy
const updateReturnPolicy = async (req, res) => {
  try {
    const icon = req.file ? req.file.path : undefined;

    const updatedData = { ...req.body };
    if (icon) updatedData.icon = icon;

    const policy = await ReturnPolicy.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!policy) return res.status(404).json({ message: "Return policy not found" });

    res.json(policy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete return policy
const deleteReturnPolicy = async (req, res) => {
  try {
    const deleted = await ReturnPolicy.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Return policy not found" });

    res.json({ message: "Return policy deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReturnPolicy,
  getAllReturnPolicies,
  updateReturnPolicy,
  deleteReturnPolicy,
};
