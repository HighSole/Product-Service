const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    size: {
      type: String,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

productVariantSchema.index({ productId: 1, size: 1 }, { unique: true });

module.exports = mongoose.model("ProductVariant", productVariantSchema);
