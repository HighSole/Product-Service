const express = require("express");
const router = require('express').Router({mergeParams:true});
const productVariantController = require("../controllers/productVariantController");
const productController = require("../controllers/productController");

// define routes
router.get("/:id", productVariantController.getProductVariantById);
router.get("/", productController.findProductById, productVariantController.getProductVariant);
router.post("/", productController.findProductById, productVariantController.addProductVariant); 
router.patch("/:id", productController.findProductById, productVariantController.findProductVariantById, productVariantController.updateProductVariant); 

module.exports = router;
