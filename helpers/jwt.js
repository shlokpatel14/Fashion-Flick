const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as necessary

async function authJwt(req, res, next) {
    const openRoutes = [
        './public/html/login.html', 
        './public/html/land.html', 
        './public/html/index.html',
        './public/html/new-arrival.html',
        './public/html/cart.html'
    ];

    if (openRoutes.includes(req.path)) {
        return next(); // Skip JWT check for open routes
    }

    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // If no Authorization header, check the cookies
    if (!token && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.secret);
        req.user = decoded;

        // Check if the user is an admin
        const user = await User.findById(req.user.userId); // Assuming userId is in the token
        if (user && user.role === 'admin') {
            // Set a cookie for the admin user
            res.cookie('isAdmin', true, { httpOnly: true, secure: true, sameSite: 'Strict' });
            // Redirect to the admin panel
            return res.status(302).redirect('/Admin/addproduct'); // Adjust the path as necessary
        }

        // Set userId in a cookie
        res.cookie('userId', req.user.userId, { httpOnly: true, secure: true, sameSite: 'Strict' });

        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token', error });
    }
}

module.exports = authJwt;
