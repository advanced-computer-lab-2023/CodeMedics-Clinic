const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({username: user.Username}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

const isAuth = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({message: 'Invalid token'});
            }
            req.user = decode;
            next();
            return;
        });
    } else {
        return res.status(401).json({message: 'Token is not supplied'});
    }
};
module.exports = {isAuth, generateToken};