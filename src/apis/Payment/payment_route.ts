import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
export const paymentRoute = express.Router()
paymentRoute
    .post('/payment/create', verifyToken(config.USER),)

    .get('/payment/cancel',)

    .get('/payment/success',)

    .post('/payment/refund',)

    .post('/payment/connect-stripe',)

    .get('/payment/success-account/:id',)

    .get('/payment/refreshAccountConnect/:id',)

    .post('/payment/maid-payment',)

    .post('/payment/transfer',)

    .patch('/payment/check',)

    .get('/payment/get-all',)