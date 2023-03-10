const ProductVariant = require("../models/productVariantModel");

// GET variants with productId (size optional)
const getProductVariant = async (req, res, next) => {
  const { productId } = req.params;
  const { size = "" } = req.query;

  try {
    const variant = await ProductVariant.find({ productId, size });
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    res.json(variant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET a single variant by ID
const getProductVariantById = async (req, res) => {
  try {
    const product = await ProductVariant.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update product variant (adds variant if not found)
const addProductVariant = async (req, res, next) => {
  const { productID, size, price, count } = req.body;

  // Check if required fields are missing
  if (!productID || !size || !price || !count) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find product
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Find or create product variant
    let productVariant = await findOrCreateProductVariant(
      productID,
      size,
      price
    );

    // Update product variant count and check for negative count
    const updatedProductVariant = await updateProductVariantCount(
      productVariant,
      count
    );
    if (!updatedProductVariant) {
      return res.status(400).json({ message: "Count cannot be negative" });
    }

    // Update associated product's count and lowest price
    await updateProductCountAndLowestPrice(product, count, price);

    // Send response
    if (updatedProductVariant.isNew) {
      res
        .status(201)
        .json({ message: "Product variant added", productVariant });
    } else {
      res
        .status(200)
        .json({ message: "Product variant updated", productVariant });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const findOrCreateProductVariant = async (productID, size, price) => {
  let productVariant = await ProductVariant.findOne({
    productId: productID,
    size: size,
  });

  if (!productVariant) {
    productVariant = new ProductVariant({
      productId: productID,
      size: size,
      price: price,
    });
  }

  return productVariant;
};

const updateProductVariantCount = async (productVariant, count) => {
  productVariant.count += count;
  const updatedProductVariant = await productVariant.save();
  return updatedProductVariant;
};

const updateProductCountAndLowestPrice = async (product, count, price) => {
  product.inventoryCount += count;
  if (!product.lowestPrice || product.lowestPrice > price) {
    product.lowestPrice = price;
  }
  await product.save();
};

module.exports = {
  getProductVariant,
  getProductVariantById,
  addProductVariant,
};
