const ShippingRate = require('../models/shippingrate');

// Get all active shipping rates
const getShippingRates = async (req, res) => {
  try {
    const rates = await ShippingRate.find({ isActive: true });
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createShippingRate = async (req, res) => {
  try {
    const { method, displayName, cost, description, isActive } = req.body;

    const existing = await ShippingRate.findOne({ method });
    if (existing) {
      return res.status(400).json({ message: 'Shipping method already exists' });
    }

    const newRate = new ShippingRate({
      method,
      displayName,
      cost,
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    await newRate.save();

    res.status(201).json({ success: true, shippingRate: newRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateShippingRate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await ShippingRate.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Shipping rate not found' });
    }

    res.status(200).json({ success: true, shippingRate: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteShippingRate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ShippingRate.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Shipping rate not found' });
    }

    res.status(200).json({ success: true, message: 'Shipping rate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getShippingRates,
  createShippingRate,
  updateShippingRate,
  deleteShippingRate
};
