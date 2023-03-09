const express = require("express");
const router = express.Router();
const productController = require("./controllers/productController");

// define routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/urlKey/:urlKey", productController.getProductByURL);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProductById);
router.delete("/:id", productController.deleteProductById);

module.exports = router;
