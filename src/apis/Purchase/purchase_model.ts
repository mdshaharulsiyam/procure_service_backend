import { model, Schema } from "mongoose";
import { IPurchase } from "./purchase_type";

const purchase_schema = new Schema<IPurchase>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required']
    },
    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue',
        required: [true, 'issue id is required']
    },
    is_reviewed: {
        type: Boolean,
        default: false
    },
    is_quoted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['open', 'connected', 'closed'],
        default: 'open'
    }
}, { timestamps: true });

export const purchase_model = model<IPurchase>('purchase', purchase_schema);