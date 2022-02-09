const router = require('express').Router()
const {
    subscribe_model
} = require('../db/opt_subscribe')
const {
    user_model
} = require('../db/sys_user')
const {
    port_model
} = require('../db/opt_port')

router.post('/sub_subscribe', (req, res, next) => {
    const {
        port_id,
        proposer_id,
        driver_name,
        phone,
        begin_time,
        end_time,
        goods_weight,
        goods_type,
        transboundary_type,
        case_number,
        license_plate
    } = req.body
    const creator = modifier = proposer_id
    port_model.find({
        port_id
    }).select('admin_id').exec((err, docs) => {
        if(!err){
            auditor_id = docs[0].admin_id
        }
    })
    user_model.find({
        _id: proposer_id
    }).select('user_status').exec((err, docs) => {
        console.log(auditor_id)
        if (!err) {
            docs[0].user_status === '1' ? // 预约人id无误 且查询user——status 为 1 即 个人信息已完善 则正常保存预约信息
                subscribe_model.insertMany({
                    auditor_id,
                    port_id,
                    proposer_id,
                    driver_name,
                    phone,
                    begin_time,
                    end_time,
                    goods_weight,
                    goods_type,
                    transboundary_type,
                    creator,
                    modifier,
                    case_number,
                    license_plate
                }, (err, docs) => {
                    if (!err) {
                        res.json({
                            code: '1111',
                            data: 'subscribe success'
                        })
                    } else {
                        res.json({
                            code: '0000',
                            data: 'ERROR ' + err
                        })
                    }
                }) :
                res.json({
                    code: '1009',
                    data: 'Please complete your personal information first' // 提示完善个人信息
                })
        } else {
            res.json({
                code: '0000',
                data: 'ERROR ' + err
            })
        }
    })

})

module.exports = router