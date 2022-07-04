const mongoose = require('mongoose');
const model = "User";
const authService = require('./../services/authService');
const cache = require('./../services/cacheService');

const userController = {
    getAll() {
        return async (req, res, next) => {

            console.log("TEST");
            try {

                console.log("Creds====", res.locals.decoded);

                let data = await mongoose.model(model).find({});
                cache.set(cache.type.user, data);
                return res.status(200).send(data);
            }
            catch (e) {
                return res.status(500).send(e.message);
            }
        }
    },
    getSingle() {
        return async (req, res, next) => {
            try {
                let data = await mongoose.model(model).findById(req.params.id);
                cache.set(cache.type.userdetail, data, req.params.id);
                return res.status(200).send(data);
            }
            catch (e) {
                return res.status(500).send(e.message);
            }
        }
    },
    update() {
        return async (req, res, next) => {
            try {
                let data = req.body;
                if (data.password) {
                    data.password = authService.getHashedPassword(data.password);
                }
                await mongoose.model(model).findOneAndUpdate({ _id: req.params.id }, {$set:data}, {new:true}, (err, result) => {
                        if (err)
                            return res.status(400).send(err);

                        cache.set(cache.type.userdetail, result, req.params.id);
                        cache.update(cache.type.user, result);
                      
                        return res.status(200).send(result)
                    });
            }
            catch (e) {
                return res.status(500).send(e);
            }
        }
    },
    delete() {
        return async (req, res, next) => {
            try {
                let result = await mongoose.model(model).deleteOne({ _id: req.params.id });
                cache.deleteKey(cache.type.userdetail, req.params.id);
                cache.removeItem(cache.type.user, req.params.id);

                return res.status(200).send(result);
            }
            catch (e) {
                return res.status(500).send(e.message);
            }
        }
    }
};

module.exports = userController;