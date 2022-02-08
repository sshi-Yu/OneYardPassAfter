const {
    admin_model
} = require('../db/opt_admin')
const router = require('express').Router()

router.post('/', (req, res, next) => {
    const {
        admin_name,
        admin_account,
        admin_passwprd,
        admin_avatar,
        admin_status,
        creator,
        modifier,
        last_modify_time
    } = req.body
    const create_time = +new Date();
    admin_model.find({// 查询account是否存在
        admin_account: 1111
    }, (err, data) => {
        if (!err) {
            if (data.length < 1) {// account不存在则正常添加
                admin_model.insertMany({
                    admin_name,
                    admin_account,
                    admin_passwprd,
                    admin_avatar,
                    admin_status,
                    creator,
                    create_time,
                    modifier,
                    last_modify_time
                }, (err, docs) => {
                    if (!err) {
                        res.json({
                            code: '1111',
                            data: docs
                        })
                    } else {
                        res.json({
                            code: '0000',
                            data: '出错了，请稍后再试'
                        })
                    }
                })
            }else{
                res.json({
                    code: '1000',
                    data: '该管理员已存在，如需修改权限请直接修改'
                })
            }
        }
    })

})

module.exports = router;