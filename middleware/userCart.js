const userCart = async (req, res, next) => {
  if (req.cookies.cartId) {
    req.cartId = req.cookies.cartId;
  }
  next();
};

module.exports = userCart 
