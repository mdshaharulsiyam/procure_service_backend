import { Types } from "mongoose";

export interface IPayment {
    purpose: string;
    session_id: string;
    transaction_id: string;
    status: boolean,
    user: Types.ObjectId,
    pay_by: string
}