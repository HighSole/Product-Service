const mongoose = require("mongoose");
const productModel = require("./productModel");

const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    size: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

productVariantSchema.index({ productId: 1, size: 1 }, { unique: true });

productVariantSchema.pre('save', async function() {
  const product = await productModel.findById(this.productId);
  if (!product) {
    throw new Error('Product not found');
  }

  //update product inventory count
  const original = await ProductVariantModel.findById(this._id);
  
  let countDiff = this.count;
  if (original) {
    const countDiff = this.count - original.count;
  }
  
  product.inventory += countDiff;

  if (product.inventory < 0) {
    throw new Error('Product inventory cannot be less than 0');
  }

  // Get all product variants for the same product that have a count greater than zero
  const productVariants = await ProductVariantModel.find({
    productId: product._id,
    count: { $gt: 0 },
    _id: { $ne: this._id }
  });

  // Add the new product variant to the list of product variants
  if (this.count > 0) {
    productVariants.push(this);
  }

  // Find the lowest price among all product variants
  const lowestPrice = productVariants.reduce((minPrice, variant) => {
    return (!minPrice || variant.price < minPrice) ? variant.price : minPrice;
  }, null);

  // Set the product's lowest price to the lowest price among all product variants
  product.lowestPrice = lowestPrice;

  await product.save();
});

const ProductVariantModel = mongoose.model('ProductVariant', productVariantSchema);



module.exports = mongoose.model("ProductVariant", productVariantSchema);
