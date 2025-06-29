const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.redirect('/login');
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;