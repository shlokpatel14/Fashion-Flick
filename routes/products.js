const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

// Setup storage and file filtering for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
    }
});

const uploadOptions = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit for each file
});

// Modify your route to handle multiple files
router.post(`/`, uploadOptions.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category');

        // Check if files object exists and if 'image' is uploaded
        const file = req.files && req.files['image'] ? req.files['image'][0] : null;
        if (!file) return res.status(400).send('No main image in the request');

        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        // Additional images handling
        const additionalImages = req.files && req.files['images'] ? req.files['images'] : [];
        const imageArray = additionalImages.map(file => `${file.filename}`);

        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription || '',
            image: `${fileName}`,  // Main image
            images: imageArray,              // Array of additional images
            brand: req.body.brand || '',
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating || 0,
            numReviews: req.body.numReviews || 0,
            isFeatured: req.body.isFeatured,
            isRecent: req.body.isRecent,
        });

        product = await product.save();

        if (!product) {
            return res.status(500).send('The product cannot be created');
        }

        res.send(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get(`/`, async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id');
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/:id',async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true}
    )

    if(!product)
    return res.status(500).send('the product cannot be updated!')

    res.send(product);
})

router.delete('/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'the product is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "product not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/isRecent`, async (req, res) =>{
    const products = await Product.find({isRecent: true});

    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})
router.get(`/get/count`, async (req, res) =>{
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})

router.get(`/get/featured`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true});

    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})

router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         const files = req.files
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }

         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true}
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

module.exports =router;