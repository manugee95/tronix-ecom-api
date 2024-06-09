const Cart = require("../models/cart");
const calculateAmount = require("../helpers/calculateAmount")

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user ? req.user._id : null;
  const cartId = req.cartId;

  try {
    let cart;
    if (userId) {
      cart =
        (await Cart.findOne({ user: userId })) ||
        (await Cart.findOne({ anonymousId: cartId }));
    } else {
      cart = await Cart.findOne({ anonymousId: cartId });
    }

    if (!cart) {
      cart = new Cart({ user: userId, anonymousId: userId ? null : cartId });
    }
    
    const productExists = cart.products.find(
      (item) => item.product.toString() === productId
    );
    if (productExists) {
      productExists.quantity += quantity;
      productExists.amount = await calculateAmount(
        productId,
        productExists.quantity
      );
    } else {
      const amount = await calculateAmount(productId, quantity);
      cart.products.push({ product: productId, quantity, amount });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const cartId = req.cartId;

  try {
    let cart;
    if (userId) {
      cart =
        (await Cart.findOne({ user: userId })) ||
        (await Cart.findOne({ anonymousId: cartId }));
    } else {
      cart = await Cart.findOne({ anonymousId: cartId });
    }

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    await cart.populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
