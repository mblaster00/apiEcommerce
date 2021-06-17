/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import Pricing from '../../models/pricing/pricing.model';

export function CreatePricing(req, res) {
    const princing = [
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'SENEGAL', pricePerKiilogram: 10000, weight: 5.6 },
        { pickupLocationCountry: 'FRANCE', dropoffLocationCountry: 'USA', pricePerKiilogram: 10000, weight: 4.2 },
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'MAROC', pricePerKiilogram: 10000, weight: 3.5 },
        { pickupLocationCountry: 'MAROC', dropoffLocationCountry: 'USA', pricePerKiilogram: 10000, weight: 1.5 },
        { pickupLocationCountry: 'USA', dropoffLocationCountry: 'FRANCE', pricePerKiilogram: 10000, weight: 6.0 },
        { pickupLocationCountry: 'FRANCE', dropoffLocationCountry: 'SENEGAL', pricePerKiilogram: 10000, weight: 3.5 },
        { pickupLocationCountry: 'CHINE', dropoffLocationCountry: 'FRANCE', pricePerKiilogram: 10000, weight: 4.0 },
    ]
    Pricing.insertMany(princing)
        .then(() => console.log('finished ceating princing'))
        .catch(err => console.log('error populating princing', err));

    return res.status(200).send('run seed pricing finish');
}