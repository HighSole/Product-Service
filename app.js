const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

const connectDB = require("./config/database");
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Routes
app.use('/purchase', require("./components/routes/purchaseRoute"));
app.use("/", require("./components/routes/productRoute"));
app.use("/:productId/variant", require("./components/routes/productVariantRoute"));

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

