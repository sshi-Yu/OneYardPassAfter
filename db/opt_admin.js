const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    admin_name: {
        type: String,
        required: [true, 'admin_name is required'],
    },
    admin_account: {
        type: String,
        required: [true, 'admin_account is required'],
    },
    admin_passwprd: {
        type: String,
        required: [true, 'admin_passwprd is required'],
    },
    admin_avatar: {
        type: String,
        required: [true, 'admin_avatar is required'],
    },
    admin_status: {
        type: String,
        default: 1 // 0停用 1正常
    },
    creator: {
        type: String,
        required: [true, 'creator is required'],
    },
    create_time: {
        type: String,
        required: [true, 'create_time is required'],
    },
    modifier: {
        type: String,
        required: [true, 'modifier is required'],
    },
    last_modify_time: {
        type: String,
        required: [true, 'last_modify_time is required'],
    },
})

const admin_model = mongoose.model('opt_admin', adminSchema)

module.exports = {
    admin_model
}