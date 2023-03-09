const express = require("express");
const router = express.Router();
const productVariantController = require("./controllers/productVariantController");

// define routes
router.get("/:id", productVariantController.getProductVariantById);
router.get("/", productVariantController.getProductVariant);
router.POST("/", productVariantController.addProductVariant); //handles update and creates variant if productId + size doesn't exist

module.exports = router;
