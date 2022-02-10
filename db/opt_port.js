const mongoose = require('mongoose')

const portSchema = new mongoose.Schema({
    admin_id: {
        type: String,
        required: [true, 'admin_id is required'],
        default: 'root'
    },
    port_name: {
        type: String,
        required: [true, 'port_name is required']
    },
    port_describe: {
        type: String,
        required: [true, 'port_describe is required']
    },
    image_url: {
        type: String,
        required: [false, 'image_url is required']
    },
    start_address: {
        type: String,
        required: [true, 'start_address is required']
    },
    end_address: {
        type: String,
        required: [true, 'end_address is required']
    },
    creator: {
        type: String,
        required: [true, 'creator is required'],
        default: 'root'
    },
    create_time: {
        type: String,
        required: [true, 'create_time is required'],
        default: new Date()
    },
    modifier: {
        type: String,
        required: [true, 'modifier is required']
    },
    modify_time: {
        type: String,
        required: [true, 'modify_time is required']
    },
    delete_flag: {
        type: String,
        required: [true, 'delete_flag is required'],
        default: '1'
    },
})

const port_model = mongoose.model('opt_port', portSchema)

module.exports = {
    port_model
}