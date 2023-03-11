const Product = require("../models/productModel");
const ProductVariant = require("../models/productVariantModel");
const axios = require("axios");

// GET all products
const getProducts = async (req, res) => {
  try {
    console.log('in products')
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductByURL = async (req, res) => {
  try {
    const product = await Product.findOne({ urlKey: req.params.urlKey });
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
    params: {limit: '10', name: req.query.name},
    headers: {
      'X-RapidAPI-Key': '0e67804651mshd941b83edfc4d32p1620b2jsn17293a37f145',
      'X-RapidAPI-Host': 'the-sneaker-database.p.rapidapi.com'
    }
  };
  console.log('in find')
  
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

  const product = new Product({
    name: req.body.name,
    brand: req.body.brand,
    make: req.body.make,
    gender: req.body.gender,
    imageLinks: req.body.imageLinks,
    description: req.body.description,
    SKU: req.body.SKU,
    colorway: req.body.colorway,
    retailPrice: req.body.retailPrice,
    releaseDate: req.body.releaseDate,
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
  const productId = req.params.id;
  const update = req.body;

  try {
    // Exclude count and lowestPrice
    delete update.count;
    delete update.lowestPrice;

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true }
    );
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// DELETE an existing product
const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductByURL,
  findProduct,
  createProduct,
  updateProductById,
  deleteProductById,
};
