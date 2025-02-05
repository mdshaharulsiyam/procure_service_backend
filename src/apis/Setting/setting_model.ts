import { model, Schema } from "mongoose";
import { ISetting } from "./setting_type";

const setting_schema = new Schema<ISetting>({
    name: { type: String, unique: true },
    desc: { type: String, trim: true, lowercase: true, required: true },
}, { timestamps: true })

export const setting_model = model('setting', setting_schema)