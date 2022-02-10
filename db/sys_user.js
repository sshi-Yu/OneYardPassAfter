const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: [true, 'user_name is required'],
    },
    user_account: {
        type: String,
        required: [true, 'user_account is required']
    },
    user_password: {
        type: String,
        required: [true, 'user_password is required']
    },
    user_avatar: {
        type: String,
        required: [false, 'user_avatar is required'],
        default: 'http://localhost:3000/images/avator.png'
    },
    user_status: {
        type: String,
        required: [false, 'user_status is required'],
        default: '1'
    },
    creator: {
        type: String,
        required: [false, 'creator is required'],
        default: 'root'
    },
    create_time: {
        type: String,
        required: [false, 'create_time is required'],
        default: new Date()
    },
    modifier: {
        type: String,
        required: [false, 'modifier is required'],
        default: 'root'
    },
    modify_time: {
        type: String,
        required: [false, 'modify_time is required'],
        default: new Date()
    },
    delete_flag: {
        type: String,
        required: [false, 'delete_flag is required'],
        default: '1'
    }
})

const user_model = mongoose.model('sys_user', userSchema)

module.exports = {
    user_model
}