import { model, Schema } from "mongoose";
import { IQuoted } from "./quoted_type";

const quoted_schema = new Schema<IQuoted>({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
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
    }
});

export const quoted_model = model<IQuoted>('quoted', quoted_schema);