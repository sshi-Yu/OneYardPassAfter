const mongoose = require('mongoose')

const db = mongoose.connect('mongodb://localhost:27017/OneYardPass')

mongoose.connection.once('open', () => {
    console.log('数据库链接成功')
})

mongoose.connection.once('close', () => {
    console.log('数据库链接失败')
})

module.exports = db