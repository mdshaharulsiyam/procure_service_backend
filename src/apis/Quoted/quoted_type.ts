import { Types } from "mongoose"

export interface IQuoted {
    user: Types.ObjectId
    user_to: Types.ObjectId
    description: String
    price: Number
    issue: Types.ObjectId,
    status: 'open' | 'connected' | 'closed' | 'cancelled'
}