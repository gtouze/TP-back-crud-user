const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        userType: {
            type: String,
            enum: ['employee', 'client'],
            default: 'employee',
            required: true,
        },
        employeeDashboard: {
            type: Boolean
        },
        clientDashboard: {
            type: Boolean
        },
        admin: {
            type: Boolean
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
    },
    { timestamps: true }
)

var UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel