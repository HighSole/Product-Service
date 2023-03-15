const router = require('express').Router();
const productVariantController = require('../controllers/productVariantController');

router.patch('/', productVariantController.updatePurchaseItems);

module.exports = router;
