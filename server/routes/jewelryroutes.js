const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const jewelryController = require('../controller/jewelryController');
const filterController = require('../controller/filterController');
const { authenticateToken ,authorizeRole } = require('../security/authentication');


router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'furnitureimages', maxCount: 20 },
    { name: 'productIcons', maxCount: 10 },
    { name: "specificationImage", maxCount: 1 }
  ]),
  jewelryController.createJewelry
);

// Update jewelry
router.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'furnitureimages', maxCount: 50 },
    { name: 'productIcons', maxCount: 10 },
    { name: "specificationImage", maxCount: 1 }
  ]),
  jewelryController.updateJewelry
);

router.delete('/:id', authenticateToken, authorizeRole('admin'), jewelryController.deleteJewelry);

router.get('/all', jewelryController.getAllJewelry);

router.get('/search', filterController.searchJewelry);

router.get('/filter', filterController.filterJewelry);
router.get('/colors', filterController.getAvailableJewelryColors);
router.get('/sizes', filterController.getAvailableJewelrySizes);
router.get('/tag/:tagName', filterController.getJewelryByTag);
router.get('/:id', jewelryController.getJewelryById);


module.exports = router;
