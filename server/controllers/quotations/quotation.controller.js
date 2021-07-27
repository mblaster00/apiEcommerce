// Imports
var Quotation = require("../../models/quotations/quotation.model");
var Item = require("../../models/items/item.model");
var Pricing = require("../../models/pricing/pricing.model");
var logger = require("../../components/logger/index");
const errorHandler = require('../../_helper/error-handler');
const axios = require('axios');
const fs = require('fs');
const transiteoToken = fs.readFileSync('./server/scheduler/authToken.JSON', "utf-8");

/* Generate PRODUCT HSCODE */
async function getHSCODE(shipmentInfos) {
    // request config
    logger.info(`-- HSCODE.REQUEST-- start function`);
    const config = {
        method: 'post',
        url: process.env.TRANSITEO_HSCODEFINDER_URL,
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${transiteoToken}` },
        data: shipmentInfos
    };
    // actual reques
    try {
        const response = await axios(config)
        if (response) {
            return await response.data.result.hs_code
        }
    } catch (error) {
        logger.info(
            `-- HSPRODUCT.ERROR-- error : ${error}`
        );
    }
}

/* Get the HSCODE of all products */
async function getHSProduct(data, totalPrice) {
    let productList = [];
    let dutyCalculation = {
        lang: "fr",
        from_country: data.pickupLocationCountry,
        to_country: data.dropoffLocationCountry,
        to_district: null,
        products: [],
        shipment_type: "GLOBAL",
        global_ship_price: totalPrice,
        currency_global_ship_price: "XOF",
        transport: {
            type: "CARRIER",
            id: "71"
        },
        sender: {
            pro: false,
            revenue_country_annual: "",
            currency_revenue_country_annual: ""
        },
        receiver: {
            "pro": false,
            "activity_id": ""
        }
    }
    try {
        logger.info(`-- HSPRODUCT.CALCULATION-- start function`);
        for (let i = 0; i < data.items.length; i++) {
            let shipmentInfos = {
                product: {
                    identification: {
                        value: data.items[i].label,
                        type: "TEXT"
                    }
                },
                lang: "fr",
                from_country: data.pickupLocationCountry,
                to_country: data.dropoffLocationCountry
            }
            await getHSCODE(shipmentInfos).then(async (hscode) => {
                await productList.push({
                    identification: {
                        value: hscode
                    },
                    weight: data.items[i].weight,
                    weight_unit: "kg",
                    quantity: data.items[i].quantity,
                    unit_price: data.items[i].price,
                    currency_unit_price: data.itemsCurrencyCode,
                    unit_ship_price: null,
                    unit: null
                })
            })
        }
        logger.info(`-- HSPRODUCT.CALCULATION-- end function`);
        dutyCalculation.products = productList
        return await dutyCalculation

    } catch (error) {
        logger.info(
            `-- HSPRODUCT.ERROR-- : ${error.response}`
        );
    }
}



// Tarif transiteo calculate duty from hscode
async function getTarif(data, totalPrice) {
    logger.info(`-- TRANSITEO.CALCULATION-- start function`);
    let HSProduct = await getHSProduct(data, totalPrice)
    // request config
    const config = {
        method: 'post',
        url: process.env.TRANSITEO_DUTYCALCULATION_URL,
        headers: { 'Content-type': 'application/json', Authorization: `Bearer ${transiteoToken}` },
        data: HSProduct
    };
    try {
        const response = await axios(config)
        if (response) {
            return await response.data.global.amount;
        }
    } catch (error) {
        logger.info(
            `-- TRANSITEO.CALCULATION.ERROR-- error : ${error}`
        );
    }
    logger.info(`-- TRANSITEO.CALCULATION-- end function`);
}

// create Quotation
exports.request = async (req, res, next) => {
    logger.info(`-- REQUEST.QUOTE -- start function --`);
    let tarif = 0;
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
        await getTarif(newQuotation, totalPrice).then((value) => { tarif = value })
        const quotation = new Quotation(newQuotation);
        logger.info(`-- REQUEST.QUOTE -- saved`);
        let response = { quoteId: quotation._id, totalItemsWeight: totalWeight, totalItemsPrice: totalPrice, totalshipmentPrice: null, shipmentCurrencyCode: "USD" }
        await Pricing.findOne({
            pickupLocationCountry: newQuotation.pickupLocationCountry,
            dropoffLocationCountry: newQuotation.dropoffLocationCountry
        }).then(pricing => {
            if (pricing) {
                shipmentPrice = pricing.pricePerKilogram * totalWeight
                response.totalshipmentPrice = shipmentPrice * 1.05 + tarif
            }
            else { logger.info(`-- PRICING -- not found`); }
        });
        return await quotation.save()
            .then((quote) => {
                logger.info("-- NEW.QUOTATION --" + `new quotation saved : ${quotation._id}`);
                return res.status(201).json({ body: quote, data: response });
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


// get quotation
exports.getQuotation = async (req, res, next) => {
    const data = req.params;
    return await Quotation.findById(data.id).exec()
        .then((result) => {
            logger.info(`-- Quotation.FINDONE -- SUCCESSFULLY`);
            res.status(200).json({ data: result });
        })
        .catch((error) => {
            logger.info(
                `-- Quotation.FINDONE-- : ${error.toString()}`
            );
            return res.status(404).json({ error: "Reference Id not found" });
        });
}

// cancelQuotation
exports.cancelQuotation = async (req, res, next) => {
    return await Quotation.findById(req.params.id).exec()
    .then(errorHandler.handleEntityNotFound(res))
    .then(errorHandler.removeEntity(res))
    .catch(error => errorHandler.handleError(res, 500,error));
};

// Upserts Quotation
exports.upsertQuotation = async (req, res, next) => {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return await Quotation.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true}).exec()
        .then(errorHandler.respondWithResult(res))
        .catch(error => errorHandler.handleError(res, 500, error));
}