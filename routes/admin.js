const {
  admin_model
} = require('../db/sys_admin')
const {
  user_model
} = require('../db/sys_user')
const {
  driver_model
} = require('../db/opt_driver')
const {
  subscribe_model
} = require('../db/opt_subscribe')
const router = require('express').Router()
const {
  create_token
} = require('../jwt/index')

/* add admin */
router.post('/', (req, res, next) => {
  const {
    admin_name,
    admin_account,
    admin_password,
    admin_avatar,
    admin_status,
    creator,
    modifier,
    last_modify_time
  } = req.body
  const create_time = +new Date();
  admin_model.find({ // 查询account是否存在
    admin_account
  }, (err, data) => {
    if (!err) {
      if (data.length < 1) { // account不存在则正常添加
        admin_model.insertMany({
          admin_name,
          admin_account,
          admin_password,
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
              data: 'ERROR ' + err
            })
          }
        })
      } else {
        res.json({
          code: '1000',
          data: '该管理员已存在，如需修改权限请直接修改'
        })
      }
    }
  })

})

/* admin login */
router.post('/login', (req, res, next) => {
  const {
    admin_account,
    admin_password
  } = req.body;
  const reg = /^1[3|4|5|8][0-9]\d{4,8}$/ //  手机号正则验证
  if (admin_account && admin_password) {
    if (reg.test(admin_account)) { // 验证通过
      admin_model.find({
        admin_account
      }, (err, docs) => {
        if (!err) {
          docs.length < 1 ? res.json({ // 账户不存在
            code: '0003',
            data: 'Account does not exist'
          }) : docs[0].admin_password == admin_password ? res.json({ // 账户存在且密码比对成功
            code: '1111',
            data: {
              msg: 'Login sucess',
              accessToken: create_token(admin_account), // 登录成功 生成token
              adminInfo: {
                admin_name: docs[0].user_name,
                admin_account: docs[0].user_account,
                admin_avatar: docs[0].user_avatar,
                admin_id: docs[0]._id
              }
            }
          }) : res.json({ // 账户存在 密码比对不成功
            code: '1110',
            data: 'The account or password does not match'
          })
        } else {
          res.json({
            code: '0000',
            data: 'ERROR，TRY AGAIN LATER'
          })
        }
      })
    } else { // 验证不通过
      res.json({
        code: '0002',
        data: 'Incorrect account format'
      })
    }
  } else {
    res.json({
      code: '0001',
      data: 'Account & password is required'
    })
  }
})

/* get pending list */
router.get('/pendingList', (req, res, next) => {
  const {
    auditor_id
  } = req.query
  subscribe_model.find({
    auditor_id,
    subscribe_status: '1' // 查询 审核状态 为 1 即审核中 的数据
  }, (err, docs) => {
    if (!err) {
      if (docs.length > 0) { // 正确查询到数据
        let data = []
        docs.forEach((i, index, arr) => { // 对查询到的所有数据进行循环
          let subscribe_item = {}
          // 使用预约人id proposer_id 到user表中查询预约人相关信息
          user_model.find({
            _id: i.proposer_id
          }).select('user_name user_account').exec((err, docs) => {
            if (!err) { // user表中查询 user_name user_account
              driver_model.find({ // driver表中查询 查询到数据则已备案 --1  无数据则未备案 --0 
                creator: i.proposer_id,
                phone: i.phone
              }, (err, driver_docs) => {
                if (!err) {
                  if (driver_docs.length == 0) {
                    subscribe_item.putOnRecord = '1'
                    subscribe_item.user_name = docs[0].user_name
                    subscribe_item.user_phone = docs[0].user_account
                    subscribe_item.driver_name = i.driver_name
                    subscribe_item.driver_phone = i.phone
                    subscribe_item.begin_time = i.begin_time
                    subscribe_item.end_time = i.end_time
                    subscribe_item.goods_weight = i.goods_weight
                    subscribe_item.goods_type = i.goods_type
                    subscribe_item.transboundary_type = i.transboundary_type
                    data.push(subscribe_item)
                  } else {
                    subscribe_item.putOnRecord = '0'
                    subscribe_item.user_name = docs[0].user_name
                    subscribe_item.user_phone = docs[0].user_account
                    subscribe_item.driver_name = i.driver_name
                    subscribe_item.driver_phone = i.phone
                    subscribe_item.begin_time = i.begin_time
                    subscribe_item.end_time = i.end_time
                    subscribe_item.goods_weight = i.goods_weight
                    subscribe_item.goods_type = i.goods_type
                    subscribe_item.transboundary_type = i.transboundary_type
                    data.push(subscribe_item)
                    if (index == arr.length - 1) { //循环结束 响应
                      res.json({
                        code: '1111',
                        data: {
                          msg: 'check success',
                          data
                        }
                      })
                    }
                  }
                }
              })

            }
          })
        })
      } else { // 没有查询到数据
        res.json({
          code: '0001',
          data: 'No Data'
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

module.exports = router;