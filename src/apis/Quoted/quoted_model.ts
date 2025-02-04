import { model, Schema } from "mongoose";
import { IQuoted } from "./quoted_type";

const quoted_schema = new Schema<IQuoted>({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    user_to: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },

    price: {
        type: Number,
        required: [true, 'price is required']
    },

    issue: {
        type: Schema.Types.ObjectId,
        ref: 'issue',
        required: [true, 'issue id is required']
    },
    
    status: {
        type: String,
        enum: ['open', 'connected', 'closed', 'cancelled'],
        default: 'open'
    },

}, { timestamps: true });

quoted_schema.index({ issue: 1, user: 1 }, { unique: true })

export const quoted_model = model<IQuoted>('quote', quoted_schema);