const mongoose = require('mongoose');
const User = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		dropDups: true,
		unique: true,
		trim: true,
		minlength: 3
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	first_name: {
        type: String,
        required:true,
	},
	last_name: {
		type: String,
	},
	email: {
		type: String,
	},
	birth_date: {
		type: Date,
    },
    join_date: {
		type: Date,
	}
}, { timestamps: { createdAt: 'created_time', updatedAt: 'last_modified_time' } });

module.exports = mongoose.model('User', User);