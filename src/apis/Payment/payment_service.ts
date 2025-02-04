import mongoose from "mongoose";
import { IPaymentData } from "../../types/data_types";
import { payment_model } from "./payment_model";
import auth_model from "../Auth/auth_model";
import config from "../../DefaultConfig/config";
import { IPayment } from "./payment_type";

async function calculate_amount(price_data: IPaymentData[]) {
    return price_data ? price_data.reduce((total, item) => {
        const unitAmount = Number(item.unit_amount) ?? 0;
        const quantity = Number(item.quantity) ?? 1;
        return total + unitAmount * quantity;
    }, 0) : 0;
}

async function create(data: { [key: string]: string | number | boolean }) {

    await payment_model.insertMany(data)
    return {
        success: true,
        message: 'payment created successfully',
    }

}

async function success_payment(data: { status: boolean, transaction_id: string }, session_id: string) {
    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const is_exists_payment = await payment_model.findOne({ session_id })
            if (!is_exists_payment) throw new Error(`payment not found`)

            const [result] = await Promise.all([
                payment_model.findByIdAndUpdate(is_exists_payment?._id, {
                    $set: {
                        ...data
                    }
                }, { session }),
                auth_model.findByIdAndUpdate(is_exists_payment?.user, { $inc: { credits: is_exists_payment?.amount * config.CREDITS_PER_DOLLAR } }, { session })
            ])
            return result

        })
    } catch (error) {
        throw error
    } finally {
        await session.endSession();
    }
}

export const payment_service = Object.freeze({
    create,
    calculate_amount,
    success_payment
})