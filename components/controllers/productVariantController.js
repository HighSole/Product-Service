const ProductVariantModel = require("../models/productVariantModel");
const mongoose = require("mongoose");

// GET variants with productId (size optional)
const getProductVariant = async (req, res, next) => {
  const query = {
    productId: res.product._id
  }

  if (req.query.size) {
    query["size"] = req.query.size
  }

  try {
    const variant = await ProductVariantModel.find(query);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    res.json(variant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single variant by ID
const getProductVariantById = async (req, res) => {
  try {
    const product = await ProductVariantModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProductVariant = async (req, res, next) => {
  const { size, price, count } = req.body;

  if (!res.product) {
    return res.status(404).json({ message: 'Cannot find product' });
  }

  if (!size || !price || !count) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (count < 0) {
    res.status(400).json({ message: "Count cannot be negative when adding a variant" });
  }

  try {
    const newProductVariant = new ProductVariantModel({
      productId: res.product.id,
      size: size,
      price: price,
      count: count,
    });

    newProductVariant.save();

    res.status(201).json({ message: "Product variant added"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProductVariant = async (req, res, next) => {
  const { price, count } = req.body;

  if (!res.productVariant) {
    return res.status(404).json({ message: 'Cannot find product variant' });
  }

  try {

    if (count && res.productVariant.count + count > 0) {
      res.productVariant.count += count;
    }
    if (price) {
      res.productVariant.price = price;
    }

    await res.productVariant.save()

    res.status(200).json({ message: "Product variant updated"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePurchaseItems = async (req, res, next) => {
  const { items } = req.body;

  // start a session
  const session = await mongoose.startSession();

  try {
    // start a transaction
    await session.withTransaction(async () => {
      // iterate through each product variant
      for (let i = 0; i < items.length; i++) {
        const { id, quantity } = items[i];

        // find the product variant by id
        const productVariant = await ProductVariantModel.findById(id).session(session);

        // if product variant not found, rollback transaction
        if (!productVariant) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Product variant ${id} not found` });
        }

        // if count is negative, rollback transaction
        if (quantity < 0) {
          await session.abortTransaction();
          return res.status(400).json({ message: "Count cannot be negative" });
        }

        // update product variant count
        productVariant.count -= quantity;
        await productVariant.save();

      }

      res.status(200).json({ message: "Product variants updated" });
    });
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({ message: error.message });
  } finally {
    // end session
    session.endSession();
  }
};

//MIDDLEWARES

//find product by id
async function findProductVariantById(req, res, next) {
  let variantId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    return res.status(400).json({ message: 'Invalid variant ID' })
  }

  try {
      productVariant = await ProductVariantModel.findById(variantId);
      if (!productVariant) {
        return res.status(404).json({ message: 'Cannot find product variant' });
      }
      res.productVariant = productVariant
      next()
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProductVariant,
  getProductVariantById,
  addProductVariant,
  updateProductVariant,
  updatePurchaseItems,
  //middleware
  findProductVariantById
};
