const mongoose = require('mongoose')
const { Schema } = mongoose

const CompanySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
)

var CompanyModel = mongoose.model('Company', CompanySchema)

module.exports = CompanyModel