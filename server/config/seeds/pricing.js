/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

const Pricing = require('../../models/pricing/pricing.model');

exports.createPricing = (req, res) => {
    const princing = [
        { pickupLocationCountry: [ 'CHINE', 'CHN'], dropoffLocationCountry: [ 'SENEGAL', 'SEN'], pricePerKilogram: 10000, weight: 5.6, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'FRANCE', 'FRA'], dropoffLocationCountry: [ 'UNITED KINGDOM', 'GBR'], pricePerKilogram: 5000, weight: 4.2, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'CHINE', 'CHN'], dropoffLocationCountry: [ 'MAROC', 'MAR'], pricePerKilogram: 6000, weight: 3.5, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'MAROC', 'MAR'], dropoffLocationCountry: [ 'UNITED KINGDOM', 'GBR'], pricePerKilogram: 7000, weight: 1.5, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'UNITED KINGDOM', 'GBR'], dropoffLocationCountry: [ 'FRANCE', 'FRA'], pricePerKilogram: 12000, weight: 6.0, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'FRANCE', 'FRA'], dropoffLocationCountry: [ 'SENEGAL', 'SEN'], pricePerKilogram: 8000, weight: 3.5, currency: 'XOF', createdAt: new Date() },
        { pickupLocationCountry: [ 'UNITED KINGDOM', 'GBR'], dropoffLocationCountry: [ 'FRANCE', 'FRA'], pricePerKilogram: 4000, weight: 4.0, currency: 'XOF', createdAt: new Date() },
    ]
    Pricing.insertMany(princing)
        .then(() => console.log('finished ceating princing'))
        .catch(err => console.log('error populating princing', err));

    return res.status(200).send('run seed pricing finish');
}