import mongoose from "mongoose";
import { business_model } from "./business_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { category_model } from "../Category/category_model";
import { IBusiness } from "./business_types";

async function create(data: IBusiness) {

    const { total_rated, rating, is_verified, total_provided_service, ...otherValues } = data
    const session = await mongoose.startSession();
    const result = await session.withTransaction(async () => {
        const [business] = await Promise.all([
            business_model.insertMany(otherValues, { session }),
            category_model.updateOne({ _id: otherValues?.services?.category }, { $inc: { total_business: 1 } }, { session })
        ])
        return business
    })
    return {
        success: true,
        message: 'business profile created successfully',
        data: result
    }


}

async function update(id: string, data: IBusiness) {

    const { total_rated, rating, is_verified, total_provided_service, auth, ...otherValues } = data

    delete otherValues.services.category;

    const result = await business_model.findOneAndUpdate({ _id: id, auth }, {
        $set: {
            ...otherValues
        }
    }, { new: true })
    return {
        success: true,
        message: 'business profile updated successfully',
        data: result
    }

}

async function delete_business(id: string, auth: string) {
    const is_exists = await business_model.findOne({ _id: id, auth })

    if (!is_exists) throw new Error(`business not found`)

    const session = await mongoose.startSession();

    const result = await session.withTransaction(async () => {
        const [result] = await Promise.all([
            business_model.findOneAndDelete({ _id: id, auth }, { session }),
            category_model.updateOne({ _id: is_exists?.services?.category }, { $inc: { total_business: -1 } }, { session })
        ])

        return result
    })
    return {
        success: true,
        message: 'service deleted successfully',
        data: result
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: string | string[], selectFields?: string | string[], modelSelect?: string) {
    return await Queries(business_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)

}

async function verify_business(id: string) {
    await business_model.findOneAndUpdate({ _id: id }, {
        $set: {
            is_verified: true
        }
    })
    return {
        success: true,
        message: 'business verified successfully'
    }
}
export const business_service = Object.freeze({
    create,
    update,
    delete_business,
    get_all,
    verify_business
})