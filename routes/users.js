var express = require('express');
var router = express.Router();
const {
  user_model
} = require('../db/sys_user')
const {
  create_token
} = require('../jwt/index')

const acc_reg = /^1[3|4|5|7|8][0-9]{9}$/ //  手机号正则验证
const pwd_req = /^\d{6,9}$/ // 密码正则 6-9位数字

/* User Login */
router.post('/login', (req, res, next) => {
  const {
    user_account,
    user_password
  } = req.body;
  if (user_account && user_password) {
    if (acc_reg.test(user_account)) { // 验证通过
      user_model.find({
        user_account
      }, (err, docs) => {
        if (!err) {
          docs.length < 1 ? res.json({ // 账户不存在
              code: '0003',
              data: 'Account does not exist'
            }) : docs[0].user_status == '1' ?// 查询账户状态 user_status 1为正常 0为已注销不可用
            docs[0].user_password === user_password ? res.json({ // 账户存在且密码比对成功
              code: '1111',
              data: {
                msg: 'Login sucess',
                accessToken: create_token(user_account) // 登录成功 生成token
              }
            }) : res.json({ // 账户存在 密码比对不成功
              code: '1110',
              data: 'The account or password does not match'
            }) : res.json({// 账户注销或不可用状态
              code: '0404',
              data: 'Account closed'
            })
        } else {
          res.json({
            code: '0000',
            data: 'ERROR ' + err
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

/* User Regist */
router.post('/regist', (req, res, next) => {
  const {
    user_account,
    user_password
  } = req.body
  const user_name = '用户 ' + user_account
  if (user_account && user_password) {
    if (acc_reg.test(user_account) && pwd_req.test(user_password)) {
      user_model.find({
        user_account
      }, (err, docs) => {
        if (!err && docs.length < 1) {
          user_model.insertMany({
            user_account,
            user_password,
            user_name
          }, (err, docs) => {
            if (!err) {
              res.json({
                code: '1111',
                data: docs[0].user_account
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
            code: '0010',
            data: 'Account is exist, to login now'
          })
        }
      })
    } else {
      res.json({ // 账号密码不合规 
        code: '0002',
        data: 'Account & password is irregularity'
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