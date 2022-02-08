const router = require('express').Router()
const {
    port_model
} = require('../db/opt_port')

/* Get portList */
router.get('/portList', (req, res, next) => {
    const {
        transboundary_type,
    } = req.query
    if (transboundary_type) { // transboundary_type  1为出境 0为入境 
        transboundary_type == 1 ? port_model.find().select('start_address end_address').exec((err, docs) => {// 查询起始地和目的地
            if (!err) {
                res.json({
                    code: '1111',
                    data: docs
                })
            } else {
                res.json({
                    code: '0000',
                    data: 'ERROR ' + err
                })
            }
        }) : port_model.find().select('start_address end_address').exec((err, docs) => {// 查询起始地和目的地
            if (!err) {
                let addressList = [];
                docs.forEach( i => {
                    addressList.push({ // transboundary 为 0 则将从数据库中所拿到的起始地和目的地的数据 处理后 返回
                        admin_id: i.admin_id,
                        start_address: i.end_address,
                        end_address: i.start_address
                    })
                })
                res.json({
                    code: '1111',
                    data: addressList
                })
            } else {
                res.json({
                    code: '0000',
                    data: 'ERROR ' + err
                })
            }
        })
    }else{
        res.json({
            code: '0001',
            data: 'transboundary_type is required'
        })
    }
})

/* add port */
router.get('/addPort', (req, res, next) => {
    const {
        port_name,
        port_describe,
        image_url,
        start_address,
        end_address,
        creator,
        create_time,
        modifier,
        modify_time,
        delete_flag
    } = req.query
    const admin_id = '6201da3f648c0870dc35789c'
    port_model.insertMany({
        admin_id,
        port_name,
        port_describe,
        image_url,
        start_address,
        end_address,
        creator,
        create_time,
        modifier,
        modify_time,
        delete_flag
    }, (err, docs) => {
        if (!err) {
            res.json({
                code: '1111',
                data: docs[0]
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