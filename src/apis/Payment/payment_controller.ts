import { Request, Response } from "express";
import Stripe from 'stripe';
import config, { HttpStatus } from "../../DefaultConfig/config";
import { IPaymentData } from "../../types/data_types";
import { payment_service } from "./payment_service";
import mongoose from "mongoose";
import { sendResponse } from "../../utils/sendResponse";
export const stripe = new Stripe(config.SRTRIPE_KEY);
async function create(req: Request, res: Response) {

    const { price_data, purpose } = req.body

    const session = await stripe.checkout.sessions.create({

        payment_method_types: ["card"],

        success_url: `${req.protocol + '://' + req.get('host')}/payment/success`,
        cancel_url: `${req.protocol + '://' + req.get('host')}/payment/cancel`,

        line_items: price_data?.map((item: IPaymentData) => ({
            price_data: {
                currency: item?.currency ?? "usd",
                product_data: {
                    name: item?.name ?? "purchase credits",
                },
                unit_amount: Number(item?.unit_amount) * 100,
            },
            quantity: item?.quantity ?? 1,
        }))
            ??
            [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Maid Booking",
                    },
                    unit_amount: Number(1) * 100,
                },
                quantity: 1,
            }],
        mode: 'payment',
    });

    const data = {
        session_id: session?.id,
        user: req.user?._id as string,
        purpose: purpose as string ?? 'buy_credits',
        amount: await payment_service.calculate_amount(price_data),
        status: false,
    }
    const result = await payment_service.create(data)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        { ...result, url: session?.url }
    )

}

async function success(req: Request, res: Response) {
    res.render('success_payment')
}

async function cancel(req: Request, res: Response,) {
    res.render('cancel_payment')
}

async function webhook(req: Request, res: Response,) {
    let event;
    const sig = req.headers['stripe-signature'];
    try {
        event = stripe.webhooks.constructEvent(req.body, sig as string | string[], config?.WEBHOOK);
    } catch (err) {
        // logger.error(err)
        console.log(err)
        return;
    }
    switch (event.type) {
        case 'checkout.session.completed':
            const session_id = event.data.object?.id

            const payment_intent = event.data.object?.payment_intent;

            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent as string);

            if (!paymentIntent || paymentIntent.amount_received === 0) {
                return console.log("Payment Not Succeeded")
            }
            await payment_service.success_payment({ status: true, transaction_id: paymentIntent.id }, session_id)
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
}

export const payment_controller = Object.freeze({
    create,
    success,
    cancel,
    webhook
})