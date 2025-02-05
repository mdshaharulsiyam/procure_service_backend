import { Document } from "mongoose";

export interface ISetting extends Document {
    name: string,
    desc: string,
    createdAt: Date;
    updatedAt: Date;
}