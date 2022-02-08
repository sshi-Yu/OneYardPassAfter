const jwt = require('jsonwebtoken')

const secret = 'oneYardPassSYS' //加密盐
const expiresIn = 60 * 60 * 24  //有效时间

/**
 * 生成token
 * data: 要存入token的数据
 */
function create_token (data){
    let token = jwt.sign({ data }, secret, { // 有效载荷必须是对象形式  {data}
        expiresIn,
        algorithm: 'HS256'
    })
    return token;
}

/**
 * 验证token
 * token: 需要验证的token
 */
function verify_token (token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, res) => {
            if(!err){
                resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

module.exports = {
    create_token,
    verify_token
}