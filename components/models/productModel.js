const mongoose = require("mongoose");
require('mongoose-type-url');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    make: { type: String },
    gender: { 
      type: String,
      enum: ["men", "women", "youth", "preschool", "infant"],
      default: "men",
    },
    image: {
      thumbnail: { type: mongoose.SchemaTypes.Url },
      original: { type: mongoose.SchemaTypes.Url },
      small: { type: mongoose.SchemaTypes.Url },
    },
    silhouette: { type: String },
    story: { type: String },
    sku: { type: String, required: true, unique: true },
    colorway: { type: String, required: true },
    retailPrice: { type: Number },
    releaseDate: { type: Date },
    releaseYear: { type: Number, min: 1900, max: 9999 },
    urlKey: { type: String, unique: true, required: true },
    inventory: { type: Number, required: true, default: 0, min: 0 },
    lowestPrice: { type: Number, min: 0},
  },
  { timestamps: true }
);

productSchema.index({ brand: "text", make: "text", style_id: "text" });

productSchema.pre("remove", async function (next) {
  try {
    // Remove all related productVariant documents
    await mongoose.model("ProductVariant").deleteMany({ productId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Product", productSchema);
