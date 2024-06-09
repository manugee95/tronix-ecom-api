const Product = require("../models/product")
const {validateProduct} = require("../validator")

exports.createProduct = async (req, res,)=>{
    try {
        const {error} = validateProduct(req.body)
        if (error) {
            res.json(error.details[0].message)
        }

        const product = new Product({
            category: req.body.category,
            name: req.body.name,
            img: req.file.path,
            price: req.body.price,
            featured: req.body.featured,
            topSelling: req.body.topSelling
        })

        const productItem = await product.save()
        res.json(productItem)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getFeaturedProducts = async(req, res)=>{
    try {
        const featured = await Product.find({featured: true}).populate('category')
        res.json(featured)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getTopSellingProducts = async(req, res)=>{
    try {
        const topSelling = await Product.find({topSelling: true}).populate('category')
        res.json(topSelling)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getAllProducts = async(req, res)=>{
    try {
        const product = await Product.find()
        res.json(product)
    } catch (error) {
        res.json({message: error.message})
    }
}

exports.getSingleProduct = async(req, res)=>{
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.json("No such product found")
        }

        res.json(product)
    } catch (error) {
        res.json({message: error.message})
    }
}