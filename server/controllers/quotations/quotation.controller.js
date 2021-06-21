// Imports
var Quotation = require("../../models/quotations/quotation.model");
var Item = require("../../models/items/item.model");
var Pricing = require("../../models/pricing/pricing.model");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');

// create Quotation
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        let lenght = req.body.items.lenght;
        let totalWeight = 0;
        let totalPrice = 0;
        let itemArray = [];
        logger.info(`-- ITEM.CREATION-- start function`);
        // try {
        //     console.log('List items======>', req.body.items)
        //     for (var i = 0; i < lenght; i++) {
        //         let item = new Item(req.body.items[i]);
        //         item.created_at = new Date()
        //         totalWeight += item.weight;
        //         totalPrice += item.price;
        //         await item.save(function(err, savedItem) {
        //             if (err) console.log(err);
        //             else{ itemArray.push(savedItem._id) }
        //         });
        //     }
        // } catch (error) {
        //     logger.info(`-- ITEM.ERROR-- : ${error.toString()}`);
        // }
        let newQuotation = {
            pickupLocationState: req.body.pickupLocationState,
            pickupLocationCountry: req.body.pickupLocationCountry,
            pickupLocationAddress: req.body.pickupLocationAddress,
            pickupLocationCity: req.body.pickupLocationCity,
            dropoffLocationState: req.body.dropoffLocationState,
            dropoffLocationCountry: req.body.dropoffLocationCountry,
            dropoffLocationAddress: req.body.dropoffLocationAddress,
            dropoffLocationCity: req.body.dropoffLocationCity,
            //items: itemArray,
            items: req.body.items,
            itemsCurrencyCode: req.body.itemsCurrencyCode,
            created_at: new Date()
        };
        const quotation = new Quotation(newQuotation);
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { totalItemsWeight: totalWeight, totalItemsPrice: totalPrice, shipmentPrice: null, shipmentCurrencyCode: "USD"}
        await Pricing.find({pickupLocationCountry: newQuotation.pickupLocationCountry,
            dropoffLocationCountry: newQuotation.dropoffLocationCountry}).then(res => {
                response.shipmentPrice = res.pricePerKilogram * totalWeight
        });
        return await quotation.save()
            .then(() => {
                logger.info("-- NEW.QUOTATION --" + `new quotation saved : ${quotation._id}`);
                return res.status(201).json({ data: response });
            })
            .catch((error) => {
                logger.info(
                    `-- QUOTATION.ERROR-- error : ${error}`
                );
            });
    } catch (error) {
        logger.info(
            `-- QUOTATION.ERROR-- : ${error.toString()}`
        );
    }
};