import mongoose, { get } from "mongoose";
import { service_model } from "./service_model";
import { category_model } from "../Category/category_model";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import hashText from "../../utils/hashText";
import { IAuth } from "../Auth/auth_types";

async function create(data: { [key: string]: string }) {
    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                service_model.insertMany(data, { session }),
                category_model.updateOne({ _id: data?.category }, { $inc: { total_service: 1 } }, { session })
            ])
            return result
        })
        return {
            success: true,
            message: 'service created successfully',
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}

async function update(id: string, data: { [key: string]: string }) {
    const is_exists = await service_model.findById(id)
    if (!is_exists) throw new Error(`service not found`)

    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {

            const [result] = await Promise.all([
                service_model.findByIdAndUpdate(id, {
                    $set: {
                        ...data
                    }
                }, { new: true, session }),
                ...(is_exists?.category?.toString() == data?.category) ? [] : [
                    category_model.updateOne({ _id: is_exists?.category }, { $inc: { total_service: -1 } }, { session }),
                    category_model.updateOne({ _id: data?.category }, { $inc: { total_service: 1 } }, { session })
                ]
            ])

            return result
        })

        return {
            success: true,
            message: 'service updated successfully',
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }

}

async function delete_service(id: string) {// data: { [key: string]: string }, auth: IAuth
    const is_exists = await service_model.findById(id)
    if (!is_exists) throw new Error(`service not found`)

    // const password = await hashText(data?.password)

    // if (password !== auth?.password) throw new Error(`password doesn't match`)

    const session = await mongoose.startSession();
    try {
        const result = await session.withTransaction(async () => {
            const [result] = await Promise.all([
                service_model.findByIdAndDelete(id, { session }),
                category_model.updateOne({ _id: is_exists?.category }, { $inc: { total_service: -1 } }, { session })
            ])
            return result
        })
        return {
            success: true,
            message: 'service deleted successfully',
            data: result
        }
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys, populatePath?: string | [string | { [key: string]: string | { [key: string]: string | { [key: string]: string } } }], selectFields?: string | string[], modelSelect?: string) {
    return await Queries(service_model, queryKeys, searchKeys, populatePath, selectFields, modelSelect)
}

export const service_service = Object.freeze({
    create,
    get_all,
    update,
    delete_service
})