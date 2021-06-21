/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const Item = require('../../models/items/item.model');

exports.createItem = (req, res) => {
    const users = [
        { label: "telephone", quantity: 1, price: 900, weight: 0.5, size: [] },
        { label: "sac", quantity: 2, price: 20, weight: 0.8, size: [] },
        { label: "montre", quantity: 3, price: 500, weight: 0.2, size: [] }
    ]
    Item.insertMany(users)
        .then(() => console.log('finished ceating items'))
        .catch(err => console.log('error populating items', err));

    return res.status(200).send('run seed items finish');
}