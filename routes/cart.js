const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');

// Add to Cart
router.post('/cart', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create a new cart if not exists
            cart = new Cart({
                userId,
                items: [{ productId, quantity, price: product.price }],
                totalPrice: product.price * quantity,
            });
        } else {
            // Update existing cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            
            if (itemIndex > -1) {
                // Product already exists in cart, update the quantity
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price += product.price * quantity;
            } else {
                // Add new product to cart
                cart.items.push({ productId, quantity, price: product.price * quantity });
            }

            cart.totalPrice += product.price * quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Get Cart for a User
router.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// Remove Item from Cart
router.delete('/cart/:userId/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === req.params.productId);
        if (itemIndex > -1) {
            cart.totalPrice -= cart.items[itemIndex].price;
            cart.items.splice(itemIndex, 1);
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
