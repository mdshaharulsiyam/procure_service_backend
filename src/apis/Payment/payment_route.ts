import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import { payment_controller } from "./payment_controller";
export const paymentRoute = express.Router()
paymentRoute
    .post('/payment/create', verifyToken(config.USER), asyncWrapper(payment_controller.create))

    .get('/payment/cancel', asyncWrapper(payment_controller.cancel))

    .get('/payment/success', asyncWrapper(payment_controller.success))
