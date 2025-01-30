import { Document, Types } from "mongoose"

export interface IPurchase extends Document {
    issue: Types.ObjectId,
    user: Types.ObjectId,
    is_quoted: boolean,
    is_reviewed: boolean
}