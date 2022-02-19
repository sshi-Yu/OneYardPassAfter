const mongoose = require('mongoose')

const subscribeSchema = new mongoose.Schema({
    auditor_id: {
        type: String,
        required: [true, 'auditor_id is required']
    },
    port_id: {
        type: String,
        required: [true, 'port_id is required']
    },
    proposer_id: {
        type: String,
        required: [true, 'proposer_id is required']
    },
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
    begin_time: {
        type: String,
        required: [true, 'begin_time is required']
    },
    end_time: {
        type: String,
        required: [true, 'end_time is required']
    },
    goods_weight: {
        type: String,
        required: [true, 'goods_weight is required']
    },
    goods_type: {// 1-医药 2-易燃物 3-食品 4-五金 5-其他
        type: String,
        required: [true, 'goods_type is required']
    },
    subscribe_status: {// 1-审核中 2-预约失败 3-预约成功 0-预约撤回
        type: String,
        required: [true, 'subscribe_status is required'],
        default: '1'
    },
    transboundary_type: {// 0-入境 1-出境
        type: String,
        required: [true, 'transboundary_type is required']
    },
    remark: {// 备注 审核未通过原因
        type: String,
        required: [false, 'remark is required'],
        default: ''
    },
    creator: {
        type: String,
        required: [true, 'creator is required'],
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
        required: [true, 'modify_time is required'],
        default: new Date()
    },
    deltete_flag: {
        type: String,
        required: [true, 'deltete_flag is required'],
        default: '1' // 0-无效 1-正常
    },
    
})

const subscribe_model = mongoose.model('opt_subscribe', subscribeSchema)

module.exports = {
    subscribe_model
}