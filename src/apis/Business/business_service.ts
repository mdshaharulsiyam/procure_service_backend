import mongoose from "mongoose";
import { business_model } from "./business_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";

async function create(data: { [key: string]: string }) {

    const { total_rated, rating, is_verified, total_provided_service, ...otherValues } = data

    const result = await business_model.insertMany(otherValues)
    return {
        success: true,
        message: 'service created successfully',
        data: result
    }


}

async function update(id: string, data: { [key: string]: string }) {
    const { total_rated, rating, is_verified, total_provided_service, auth, ...otherValues } = data
    const result = await business_model.findOneAndUpdate({ _id: id, auth }, {
        $set: {
            ...otherValues
        }
    }, { new: true })
    return {
        success: true,
        message: 'service updated successfully',
        data: result
    }

}

async function delete_business(id: string, auth: string) {
    const result = await business_model.findOneAndDelete({ _id: id, auth })
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