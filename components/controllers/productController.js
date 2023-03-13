const ProductModel = require("../models/productModel");
const axios = require("axios");
const mongoose = require("mongoose");

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single product by ID
const getProductById = async (req, res) => {
  if (!res.product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(res.product);
};

const getProductByURL = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ urlKey: req.params.urlKey });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const findProduct = async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://the-sneaker-database.p.rapidapi.com/sneakers',
    params: {limit: '10', name: req.query.name, gender: req.query.gender},
    headers: {
      'X-RapidAPI-Key': '0e67804651mshd941b83edfc4d32p1620b2jsn17293a37f145',
      'X-RapidAPI-Host': 'the-sneaker-database.p.rapidapi.com',
    }
  };
  
  try {
    axios.request(options).then(function (response) {
      return res.status(200).json(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a new product
const createProduct = async (req, res) => {
  const urlKey = req.body.name
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/\s+/g, "-");
  
  const image = { 
    thumbnail: req.body.image.thumbnail,
    original: req.body.image.thumbnail,
    small: req.body.image.small 
  };

  const product = new ProductModel({
    name: req.body.name,
    brand: req.body.brand,
    make: req.body.make,
    gender: req.body.gender,
    image: image,
    story: req.body.story,
    sku: req.body.sku,
    colorway: req.body.colorway,
    retailPrice: req.body.retailPrice,
    releaseDate: req.body.releaseDate,
    releaseYear: req.body.releaseYear,
    urlKey: urlKey,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE an existing product
const updateProductById = async (req, res) => {
  const update = req.body;

  try {
    // Exclude count and lowestPrice
    delete update.inventory;
    delete update.lowestPrice;

    const product = await ProductModel.findByIdAndUpdate(
      res.product.id,
      { $set: req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE an existing product
const deleteProductById = async (req, res) => {
  if (!res.product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    await ProductModel.deleteOne({_id: res.product.id});

    res.status(200).json({ message: 'Deleted product' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
};


//MIDDLEWARES

//find product by id
async function findProductById(req, res, next) {
  let productId = req.params.id;
  //if middleware used by product variant
  if (req.params.productId) {
    productId = req.params.productId
  }


  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }

  try {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Cannot find product' });
      }
      res.product = product
      next()
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

}

module.exports = {
  getProducts,
  getProductById,
  getProductByURL,
  findProduct,
  createProduct,
  updateProductById,
  deleteProductById,
  //middleware
  findProductById,
};
