/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const User = require('../../models/users/user.model');

exports.createUser = (req, res) => {
    const users = [
        {username: "user1", email: "user1@gmail.com", phone: "781234568",  companyName: "Logidoo",  country: "Senegal",  password: "2wladminpass123",  accessToken: " ",  active: false,  created_at: new Date(),  updated_at: new Date()},
        {username: "user2", email: "user2@gmail.com", phone: "771234567",  companyName: "Logidoo",  country: "Senegal",  password: "2wladminpass123",  accessToken: " ",  active: false,  created_at: new Date(),  updated_at: new Date()},
        {username: "user3", email: "user3@gmail.com", phone: "781234567",  companyName: "Logidoo",  country: "Senegal",  password: "2wladminpass123",  accessToken: " ",  active: false,  created_at: new Date(),  updated_at: new Date()}
    ]
    User.insertMany(users)
        .then(() => console.log('finished ceating users'))
        .catch(err => console.log('error populating users', err));

    return res.status(200).send('run seed users finish');
}