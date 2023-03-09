const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    make: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Youth", "Infants"],
      default: "Men",
    },
    imageLinks: {
      type: [mongoose.SchemaTypes.Url],
    },
    description: {
      type: String,
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
    colorway: {
      type: String,
      required: true,
    },
    retailPrice: {
      type: Number,
    },
    releaseDate: {
      type: Date,
    },
    urlKey: {
      type: String,
      unique: true,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
    lowestPrice: {
      type: Number,
    },
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
