const router = require('express').Router()
const {
    driver_model
} = require('../db/opt_driver')

router.post('/append', (req, res, next) => {
    const {
        driver_name,
        phone,
        case_number,
        license_plate,
        user_id
    } = req.body
    driver_model.find({
            creator: user_id
        }).select('driver_name phone case_number license_plate')
        .exec((err, docs) => {
            if (!err && docs.length > 0) {
                if (phone === docs[0].phone) { // 查询在当前 用户id下若已注册了phone号码相同的 则不可再次添加
                    res.json({
                        code: '1000',
                        data: 'Non-repeatable addition'
                    })
                } else { // 若phone不想同 则表示此用户下并未绑定该phone号码 可正常添加
                    driver_model.insertMany({
                        driver_name,
                        case_number,
                        license_plate,
                        phone,
                        creator: user_id,
                        modifier: user_id
                    }, (err, docs) => {
                        if (!err) {
                            res.json({
                                code: '1111',
                                data: 'append success'
                            })
                        } else {
                            res.json({
                                code: '0000',
                                data: 'ERROR ' + err
                            })
                        }
                    })
                }
            } else if (docs.length == 0) {// 若未查询到该用户id所添加过得数据 则可正常添加
                driver_model.insertMany({
                    driver_name,
                    case_number,
                    license_plate,
                    phone,
                    creator: user_id,
                    modifier: user_id
                }, (err, docs) => {
                    if (!err) {
                        res.json({
                            code: '1111',
                            data: 'append success'
                        })
                    } else {
                        res.json({
                            code: '0000',
                            data: 'ERROR ' + err
                        })
                    }
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