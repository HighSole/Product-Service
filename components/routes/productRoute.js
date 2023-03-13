const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// define routes
router.get("/", productController.getProducts);
router.get("/find", productController.findProduct);
router.get("/:id", productController.findProductById, productController.getProductById);
router.get("/urlKey/:urlKey", productController.getProductByURL);
router.post("/", productController.createProduct);
router.patch("/:id", productController.findProductById, productController.updateProductById);
router.delete("/:id", productController.findProductById, productController.deleteProductById);

module.exports = router;
