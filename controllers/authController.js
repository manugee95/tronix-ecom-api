const User = require("../models/user");
const Cart = require("../models/cart");
const calculateAmount = require("../helpers/calculateAmount");
const validatePassword = require("../helpers/validatePassword");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
	const { firstName, lastName, email, phone, password, confirmPassword, role } =
		req.body;

	//Check is password match
	if (password !== confirmPassword) {
		return res.json("Password do not match");
	}

	//Validate Password
	if (!validatePassword(password)) {
		return res.json("validatePassword");
	}

	try {
		let user = await User.findOne({ email });
		if (user) {
			res.json("exist");
		} else {
			user = new User({ firstName, lastName, email, phone, password, role });
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			await user.save();

			// create a new cart for currently logged in user
			const cart = new Cart({
				user: user._id,
				anonymousId: null,
			});

			await cart.save();

			// set the now logged in cart user as the cart id
			res.cookie("cartId", user._id, {
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				path: "/",
				domain: "localhost",
				httpOnly: true,
			});

			const token = user.generateAuthToken();
			res.header("auth-token", token).json(user);
		}
	} catch (error) {
		res.json({ message: error.message });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;
	const cartId = req.cartId;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json("Invalid Email/Password");
		}

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.json("Invalid Email/Password");
		}

		const anonymousCart = await Cart.findOne({ anonymousId: cartId });
		let userCart = await Cart.findOne({ user: user._id });

		if (anonymousCart) {
			if (userCart) {
				for (const item of anonymousCart.products) {
					const existingProduct = userCart.products.find(
						(p) => p.product.toString() === item.product.toString()
					);
					if (existingProduct) {
						existingProduct.quantity += item.quantity;
						existingProduct.amount = await calculateAmount(
							item.product,
							existingProduct.quantity
						);
					} else {
						item.amount = await calculateAmount(item.product, item.quantity);
						userCart.products.push(item);
					}
				}
				await userCart.save();
				await anonymousCart.remove();

				// set the now logged in cart user as the cart id
				res.cookie("cartId", userCart.user, {
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					path: "/",
					domain: "localhost",
					httpOnly: true,
				});
			} else {
				for (const item of anonymousCart.products) {
					item.amount = await calculateAmount(item.product, item.quantity);
				}
				anonymousCart.user = user._id;
				anonymousCart.anonymousId = null;
				await anonymousCart.save();
				// set the now logged in cart user as the cart id
				res.cookie("cartId", anonymousCart.user, {
					expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
					path: "/",
					domain: "localhost",
					httpOnly: true,
				});
			}
		} else {
			// set the now logged in cart user as the cart id
			res.cookie("cartId", user._id, {
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				path: "/",
				domain: "localhost",
				httpOnly: true,
			});
		}

		const token = user.generateAuthToken();
		res.json({ token });
	} catch (error) {
		res.json({ message: error.message });
	}
};

exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		res.json({ error: err.message });
	}
};

exports.logout = async (req, res) => {
	res.cookie("cartId", "", {
		expires: new Date(0),
		path: "/",
		domain: "localhost",
		httpOnly: true,
	});
};
