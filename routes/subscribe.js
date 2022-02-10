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

/* submit subscribe */
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
        if (!err) {
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

/* get subscribe list */
router.get('/subscribeList', (req, res, next) => {
    const {
        user_id,
    } = req.query
    if (user_id) {
        subscribe_model.find({
                proposer_id: user_id
            }).select('subscribe_status modify_time transboundary_type port_id subscribe_status')
            .exec((err, docs) => {
                if (!err) {
                    if (docs.length > 0) {
                        let sub_list = []
                        docs.forEach((i, index, arr) => {
                            port_model.find({ // 根据portid查询portname
                                _id: i.port_id
                            }).select('port_name start_address end_address').exec((err, docs) => {
                                if (!err) {
                                    if (i.transboundary_type === '1') {
                                        let obj = {
                                            subscribe_status: i.subscribe_status,
                                            start_address: docs[0].start_address,
                                            end_address: docs[0].end_address,
                                            modify_time: i.modify_time,
                                            transboundary_type: i.transboundary_type,
                                            port_name: docs[0].port_name,
                                            audit_status: i.subscribe_status,
                                            _id: i._id
                                        }
                                        sub_list.push(obj)
                                    } else {
                                        let obj = {
                                            subscribe_status: i.subscribe_status,
                                            start_address: docs[0].end_address,
                                            end_address: docs[0].start_address,
                                            modify_time: i.modify_time,
                                            transboundary_type: i.transboundary_type,
                                            port_name: docs[0].port_name,
                                            audit_status: i.subscribe_status,
                                            _id: i._id
                                        }
                                        sub_list.push(obj)
                                    }
                                    if (index == arr.length - 1) { // 当循环执行完毕 响应
                                        res.json({
                                            code: '1111',
                                            data: {
                                                msg: 'check success',
                                                subscribeList: sub_list
                                            }
                                        })
                                    }
                                }
                            })

                        })
                    } else {
                        res.json({
                            code: '1000',
                            data: 'No reservation information was found'
                        })
                    }
                } else {
                    res.json({
                        code: '0000',
                        data: 'ERROR ' + err
                    })
                }
            })
    } else {

    }
})

/* get subscribeInfo to create qrcode */
router.get('/subscribeInfo', (req, res, next) => {
    const {
        subscribe_id,
        user_id
    } = req.query
    subscribe_model.find({
            _id: subscribe_id
        }).select('proposer_id begin_time end_time goods_weight goods_type transboundary_type delete_flag')
        .exec((err, docs) => {
            if (!err) {
                if (docs.length > 0) {
                    docs[0].delete_flag === '0' && user_id === docs[0].proposer_id ? res.json({ // 查询状态 0为失效 1为正常 并且比对用户id是否一致
                        code: '1001',
                        data: 'Reservation expired'
                    }) : new Date(docs[0].end_time).getTime() > +new Date() && new Date(docs[0].begin_time).getTime() < +new Date() ? res.json({// 在所预约的时间段内
                        code: '1111',
                        data: {
                            msg: 'get subscribeInfo success',
                            subscribeInfo: {
                                begin_time: docs[0].begin_time,
                                end_time: docs[0].end_time,
                                goods_weight: docs[0].goods_weight,
                                goods_type: docs[0].goods_type,
                                transboundary_type: docs[0].transboundary_type
                            }
                        }
                    }) : res.json({// 不在指定时间段
                        code: '1002',
                        data: 'Not within the specified time period',
                    })
                } else {
                    res.json({
                        code: '0001',
                        data: 'subscribe info not found'
                    })
                }
            } else {
                res.json({
                    code: '0000',
                    data: 'ERROR ' + err
                })
            }
        })
})

module.exports = router