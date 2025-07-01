const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.id);

        if(!user) return res.redirect('/');

        req.user = user;
        next();
    } catch (error){
        return res.redirect('/');
    }
};

module.exports = authenticateUser;