const mongoose = require('mongoose');
const validator = require('validator');

var CompanySchema = new mongoose.Schema({
    name :{
        type: String,
        required: true, 
        trim: true
    },
    site_url: {
        type: String,
        required: true,
        validate(value){
            if (!validator.isURL(value)){
                throw new Error('Link is invalid');
            }
        }
    }
}, { timestamps: true }
);

const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;