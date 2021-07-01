// Imports
var Quotation = require("../../models/quotations/quotation.model");
var Item = require("../../models/items/item.model");
var Pricing = require("../../models/pricing/pricing.model");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');
const axios = require('axios');


// create Quotation
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    try {
        let length = req.body.items.length;
        let totalWeight = 0;
        let totalPrice = 0;
        logger.info(`-- ITEM.CREATION-- start function`);
        try {
            if (length > 0)
                for (var i = 0; i < length; i++) {
                    let item = req.body.items[i];
                    totalWeight += item.weight;
                    totalPrice += item.price;
                }
        } catch (error) {
            logger.info(`-- ITEM.ERROR-- : ${error.toString()}`);
        }
        let newQuotation = {
            pickupLocationState: req.body.pickupLocationState,
            pickupLocationCountry: req.body.pickupLocationCountry,
            pickupLocationAddress: req.body.pickupLocationAddress,
            pickupLocationCity: req.body.pickupLocationCity,
            dropoffLocationState: req.body.dropoffLocationState,
            dropoffLocationCountry: req.body.dropoffLocationCountry,
            dropoffLocationAddress: req.body.dropoffLocationAddress,
            dropoffLocationCity: req.body.dropoffLocationCity,
            items: req.body.items,
            itemsCurrencyCode: req.body.itemsCurrencyCode,
            created_at: new Date()
        };
        const quotation = new Quotation(newQuotation);
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { quoteId: quotation._id,totalItemsWeight: totalWeight, totalItemsPrice: totalPrice, totalshipmentPrice: null, shipmentCurrencyCode: "USD"}
        await Pricing.find({pickupLocationCountry: newQuotation.pickupLocationCountry,
            dropoffLocationCountry: newQuotation.dropoffLocationCountry}).then(res => {
                shipmentPrice = res.pricePerKilogram * totalWeight 
                response.totalshipmentPrice = shipmentPrice * 1.05 
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



    /* 
        Generate PRODUCT HSCODE
    */

    exports.getHSCODE = async (shipmentInfos, transiteoToken) => {

        // request config
        const config = {
            method: 'post',
            url: process.env.TRANSITEO_HSCODEFINDER_URL,
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${transiteoToken}` },
            data: shipmentInfos
        };

        // actual reques
        axios(config)
            .then(async result => {
                if(result.data.result.hscode) {
                    return result.data.result.hscode
                }
            })
            .catch(err => {
                console.log(err)
            });
    }



};