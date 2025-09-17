const mongoose = require('mongoose');
const validator = require('validator');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            } 
        }
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        number: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        lon:{
            type: Number
        },
        lat:{
            type: Number
        }
    }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
