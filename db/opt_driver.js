const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    driver_name: {
        type: String,
        required: [true, 'driver_name is required']
    },
    phone: {
        type: String,
        required: [true, 'phone is required']
    },
    case_number: {
        type: String,
        required: [true, 'case_number is required']
    },
    license_plate: {
        type: String,
        required: [true, 'license_plate is required']
    },
    create_time: {
        type: String,
        required: [true, 'create_time is required'],
        default: new Date()
    },
    creator: {
        type: String,
        required: [true, 'creator is required']
    },
    modifier: {
        type: String,
        required: [true, 'modifier is required']
    },
    modify_time: {
        type: String,
        required: [true, 'modify_time is required'],
        default: new Date()
    },
    deltete_flag: {
        type: String,
        required: [true, 'deltete_flag is required'],
        default: '1' // 0-无效 1-正常
    },
})

const driver_model = mongoose.model('opt_driver', driverSchema)

module.exports = {
    driver_model
}