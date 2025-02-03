import { model, Schema } from "mongoose";
import { ICategory } from "./category_type";

const category_schema = new Schema<ICategory>({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    img: {
        type: String,
        required: [true, 'img is required']
    },
    total_business: {
        type: Number,
        default: 0
    },
    total_service: {
        type: Number,
        default: 0
    },
    quote_price: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

export const category_model = model<ICategory>('category', category_schema);