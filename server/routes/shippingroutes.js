const express = require('express');
const router = express.Router();

const {
  getShippingRates,
  createShippingRate,
  updateShippingRate,
  deleteShippingRate
} = require('../controller/shippingratecontroller');

router.get('/', getShippingRates);
router.post('/',createShippingRate);
router.put('/:id', updateShippingRate);
router.delete('/:id',  deleteShippingRate);

module.exports = router;
