import { Types } from "mongoose"

export interface IQuoted {
    user: Types.ObjectId
    description: String
    price: Number
    issue: Types.ObjectId
}