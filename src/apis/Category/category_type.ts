import { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    img: string;
    total_business: Number;
    total_service: Number;
    quote_price: Number;
}