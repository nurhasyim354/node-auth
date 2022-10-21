const mongoose = require('mongoose');
const model = "User";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AuthService = require('./../services/authService');
const cache = require('./../services/cacheService');

const authController = {
    register() {
        return async (req, res, next) => {
            let data = req.body;
            if (!data.password) {
                return res.status(400).send("Please make sure all required fields are valid");
            }
            const hashedPassword = AuthService.getHashedPassword(data.password);
            data.password = hashedPassword;
            await mongoose.model(model).create(data, (err, user) => {
                if (err) {
                    if (err.name === 'ValidationError') {
                        return res.status(400).send("Please make sure all required fields are valid");
                    }
                    if (err.name === 'MongoError') {
                        console.log({err});
                        return res.status(400).send("Username was registered or email is duplicate.");
                    }
                    return res.status(400).send(err.name);
                }

                cache.set(cache.type.userdetail, user, user._id);
                cache.update(cache.type.user, user);

                const token = jwt.sign({ id: user._id }, AuthService.secret, {
                    expiresIn: AuthService.tokenLifeTimespan
                });
                res.status(200).send({ auth: true, token: token });
            });
        };
    },

    getProfile() {
        return async (req, res, next) => {
            try {
                const data = await mongoose.model(model).findById(req.userId, { password: 0 });
                if (!data)
                    return res.status(400).send('invalid user');
                res.status(200).send(data);
            }
            catch (e) {
                return res.status(500).send(e.message);
            }
        }
    },

    login() {
        return async (req, res) => {
            let data = req.body;
            await mongoose.model(model).findOne({ username: data.username })
                .exec((err, user) => {
                    if (err) {
                        return res.status(401).send('Authentication failed');
                    }
                    if (!user) {
                        return res.status(401).send('Authentication failed');
                    }

                    const passwordIsValid = bcrypt.compareSync(data.password, user.password);
                    if (!passwordIsValid) {
                        return res.status(401).send('Authentication failed');
                    }
                    const token = jwt.sign({ id: user._id }, AuthService.secret, {
                        expiresIn: AuthService.tokenLifeTimespan
                    });
                    res.status(200).send({
                        auth: true,
                        token: token,
                        user: {
                            username: user.username,
                            email: user.email,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            join_date: user.join_date,
                        }
                    });
                });
        }
    }
}
module.exports = authController;