const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authService = {
    secret: process.env.AUTH_SECRET,
    tokenLifeTimespan: parseInt(process.env.AUTH_TOKEN_LIFETIMESPAN),
    verifyToken() {
        return (req, res, next) => {
            const token = req.headers['x-access-token'];
            if (!token) {
                return res.status(401).send({ auth: false, message: 'No token provided.' });
            }
            jwt.verify(token, this.secret, function (err, decoded) {
                if (err) {
                    return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
                }
                req.userId = decoded.id;

                res.locals.auth = { credentials: decoded };

                return next();
            });
        }
    },
    getHashedPassword(password){
        return bcrypt.hashSync(password, 8);
    }
};
module.exports = authService;
