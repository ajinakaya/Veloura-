const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const sizeGuideController = require('../controller/sizeguideController');
const { authenticateToken , authorizeRole } = require('../security/authentication');


router.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  upload.fields([
    { name: 'images', maxCount: 5 }
  ]),
  sizeGuideController.createSizeGuide
);

router.get('/', sizeGuideController.getAllSizeGuides);

router.get('/:id', sizeGuideController.getSizeGuideById);
router.put(
  '/:id',
  authenticateToken,
    authorizeRole('admin'),
  upload.fields([
    { name: 'images', maxCount: 5 }
  ]),
  sizeGuideController.updateSizeGuide
);

router.delete('/:id', authenticateToken, authorizeRole('admin'), sizeGuideController.deleteSizeGuide);

module.exports = router;
