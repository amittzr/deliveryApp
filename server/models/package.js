const mongoose = require('mongoose');
const Company = require('../models/company');
const Customer = require('./customer');
const { trim } = require('validator');

var PackageSchema = new mongoose.Schema({
    // packageId: {
    //     type: String,
    //     required: true,
    //     minlength: 3,
    //     trim: true
    // },
    prod_id:{
        type: String,
        trim:true,
        // minlength:3
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    eta:{
        type: Date
    },
    status:{
        type: String,
        enum:['packed', 'shipped', 'in transit', 'delivered'],
        default: 'packed'
    },
    path: [
        {
            lat: {
                type: Number,
                required: true
            },
            lon: {
                type: Number,
                required: true
            }
        }
    ],
    buisness_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        validate: {
            validator: async function (value) {
                return await Company.exists({ _id: value });
            },
            message: 'Company with the specified ID does not exist.'
        }
    },
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        validate: {
            validator: async function (value){
                return await Customer.exists({_id: value});
            },
            message: 'Customer with the specified ID does not exist.'
        }
    },
}, {timestamps: true}
);

const Package = mongoose.model('Package', PackageSchema);

module.exports = Package;