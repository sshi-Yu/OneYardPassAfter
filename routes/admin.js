const {
  admin_model
} = require('../db/sys_admin')
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
              accessToken: create_token(admin_account) // 登录成功 生成token
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

module.exports = router;