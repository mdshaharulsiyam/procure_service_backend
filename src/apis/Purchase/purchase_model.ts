import { Schema } from "mongoose";
import { IPurchase } from "./purchase_type";

const purchase_schema = new Schema<IPurchase>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue',
        required: true
    },
    is_reviewed: {
        type: Boolean,
        default: false
    },
    is_quoted: {
        type: Boolean,
        default: false
    },
})