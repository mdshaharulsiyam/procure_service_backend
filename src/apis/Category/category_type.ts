import { Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    img: string;
    available_position: Number;
    total_service: Number;
    quote_price: Number;
}