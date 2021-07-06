/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const Pricing = require('../../models/pricing/pricing.model');

exports.createPricing = (req, res) => {
    const princing = [
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'SENEGAL', pricePerKilogram: 10000, weight: 5.6, createdAt: new Date() },
        { pickupLocationCountry: 'FRANCE', dropoffLocationCountry: 'USA', pricePerKilogram: 10000, weight: 4.2, createdAt: new Date() },
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'MAROC', pricePerKilogram: 10000, weight: 3.5, createdAt: new Date() },
        { pickupLocationCountry: 'MAROC', dropoffLocationCountry: 'USA', pricePerKilogram: 10000, weight: 1.5, createdAt: new Date() },
        { pickupLocationCountry: 'USA', dropoffLocationCountry: 'FRANCE', pricePerKilogram: 10000, weight: 6.0, createdAt: new Date() },
        { pickupLocationCountry: 'FRANCE', dropoffLocationCountry: 'SENEGAL', pricePerKilogram: 10000, weight: 3.5, createdAt: new Date() },
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'FRANCE', pricePerKilogram: 10000, weight: 4.0, createdAt: new Date() },
    ]
    Pricing.insertMany(princing)
        .then(() => console.log('finished ceating princing'))
        .catch(err => console.log('error populating princing', err));

    return res.status(200).send('run seed pricing finish');
}