const Product = require("../models/product");

const calculateAmount = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  return product.price * quantity;
};

module.exports = calculateAmount