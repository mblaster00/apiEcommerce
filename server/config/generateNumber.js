const Setting = require("../models/setting/setting.model");

exports.getTrackingNumber = async () => {
    let count
    await Setting.findOneAndUpdate(
        { name:  'tracking'},
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
    ).then(seq => {
        count = seq.sequence
    }).catch(err => {throw err})

    const dt = new Date()
    let month = dt.getMonth() + 1
    if (month <= 9) {
        month = `0${month}`
    }
    const year = dt.getFullYear().toString().substr(-2)
    const date = `${month}${year}`
    const random = Math.floor(Math.random() * 9000) + 1000;
    const pad = '00000'
    const counter = pad.substr(0, pad.length - count.toString().length) + count
    return `${date}${random}${counter}`
}