var cron = require('node-cron');
const qs = require('qs');
const fs = require("fs");
const axios = require('axios');

/*
    Get auth token from Transiteo
*/
const authTask = cron.schedule('* */45 * * * *', async (req, res, next) => {
    // request body
    const data = qs.stringify({
        client_id: process.env.TRANSITEO_CLIENT_ID,
        refresh_token: process.env.TRANSITEO_REFRESH_TOKEN,
        grant_type: "refresh_token",
    })
    // request config
    const config = {
        method: 'post',
        url: process.env.TRANSITEO_AUTH_URL,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: data
    }
    axios(config)
        .then(result => {
            //console.log("id token =======>", result.data.id_token)
            fs.writeFileSync('./server/scheduler/authToken.JSON', result.data.id_token);
        })
        .catch(err => 
            res.status(400).send({ message: 'Transiteo authentification failed'})
            //console.log(err)
        )
});

module.exports = authTask