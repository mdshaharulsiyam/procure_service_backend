export interface IPaymentData extends Document {
    currency: string,
    name: string,
    unit_amount: Number,
    quantity: Number
}